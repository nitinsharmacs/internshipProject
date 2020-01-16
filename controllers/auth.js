// importing 3rd party packages
const { validationResult }= require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


// making transporter 
const transporter = nodemailer.createTransport(sendgridTransport({
	auth:{
		api_key: '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'
	}
}));

// importing User model
const User = require('../models/users');

const signup = (req, res, next) => {
	const errors = validationResult(req);
	if(!errors.isEmpty()){
		// invalid inputs 
		const error = new Error(errors.array().map(err=>err.msg)[0]);
		error.statusCode = 442;
		return next(error);
	}
	
	const useremail = req.body.useremail;
	const password = req.body.password;
	let hashedPassword;
	User.findByEmail(useremail).then(user=>{
		if(user){
			// user is present
			const error = new Error('User is present !');
			error.statusCode = 403;
			throw error;
		}
		console.log(user);
		return bcrypt.hash(password, 12);
	}).then(passcode=>{
		if(!passcode){
			throw new Error('Internal server Error !');
		}
		hashedPassword = passcode;
		const user = new User({useremail: useremail, password: hashedPassword});
		return user.save();
	}).then(result=>{
		if(!result){
			throw new Error('Internal server Error! (User not created!)');
		}
		return res.status(201).json({message: 'User created!', data: result.ops[0]});
	}).catch(err=>{
		console.log(err.message);
		return next(err);
	});

};

// METHOD FOR LOGIN
const login = (req, res, next) => {
	let userinfo;
	if(!req.body){
		const error = new Error('Invalid request !');
		error.statusCode = 422;
		return next(error)
	}
	User.findByEmail(req.body.useremail).then(user=>{
		if(!user){
			const error = new Error('User not found !');
			error.statusCode = 404;
			throw error;
		}
		userinfo = user;
		return bcrypt.compare(req.body.password, user.password);
	}).then(match=>{
		if(!match){
			const error = new Error('Invalid credientials (Invalid password) !');
			error.statusCode = 404;
			throw error;
		}
		const token = jwt.sign({
			useremail: userinfo.useremail,
			id: userinfo._id.toString()
		}, 'nitinsharmscs', {expiresIn:'1h'});
		return res.status(200).json({message:'Login successfully!', token: token, userid: userinfo._id.toString()});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
};	

// METHOD FOR FORGOT PASSWORD
const forgotpassword = (req, res, next) => {
	if(!req.body){
		const error = new Error('Invalid request !');
		error.statusCode = 422;
		return next(error);
	}
	const useremail = req.body.useremail;
	let OTP;
	User.findByEmail(useremail).then(user=>{
		if(!user){
			// user not found!
			const error  = new Error('User not found!');
			error.statusCode = 404;
			throw error;
		}
		OTP = Math.floor(1000 + Math.random()*9000);
		return User.updateUser(useremail, 'OTP' , OTP);
	}).then(result=>{
		if(!result){
			throw new Error('Internal server error');
		}
		transporter.sendMail({
			to: useremail,
			from:'proxy@support.com',
			subject:'OTP for change password',
			html: `
				<div>
					<center>OTP for changing password is ${OTP}</center>
				</div>
			`
		}).then(response=>console.log('mail send'));
		return res.status(200).json({message: 'OTP SENt', status: 200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
};

// METHOD CHANGING PASSWORD
const newpassword = (req, res, next) => {
	if(!req.body){
		const error = new Error('Invalid request !');
		error.statusCode = 422;
		return next(error);
	}
	const errors = validationResult(req);
	console.log(errors);
	if(!errors.isEmpty()){
		const error = new Error(errors.array().map(err=>err.msg)[0]);
		error.statusCode = 422;
		return next(error);
	}
	const useremail = req.body.useremail;
	const password = req.body.password;
	const otp = req.body.otp;
	User.findByEmail(useremail).then(user=>{
		if(!user){
			const error = new Error('User not found!');
			error.statusCode = 404;
			throw error;
		}
		if(otp.toString().trim() !== user.otp.toString().trim()){
			const error = new Error('Invalid OTP !');
			error.statusCode = 422;
			throw error;
		}
		return bcrypt.hash(password, 12);
	}).then(passcode=>{
		if(!passcode){
			throw new Error('Internal Server Error!');
		}
		return User.updateUser(useremail, 'PASSWORD' , passcode);
	}).then(result=>{
		if(!result){
			throw new Error('Password not changed. (Internal server error)');
		}
		return User.updateUser(useremail, 'OTP' , undefined);
	}).then(result=>{
		return res.status(201).json({message:'Password changed!', data: useremail, status: 201});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});
};

module.exports = {
	signup: signup,
	login:login,
	forgotpassword: forgotpassword,
	newpassword: newpassword
};