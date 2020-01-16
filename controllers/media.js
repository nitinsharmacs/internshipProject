// importing video model
const Video = require('../models/video');

const upload = (req, res, next) => {
	if(!req.logined){
		const error = new Error('UnAuthorized User !');
		error.statusCode = 422;
		return next(error);
	}
	if(!req.file){
		const error = new Error('Please upload Video !');
		error.statusCode = 422;
		return next(error);
	}

	const videoinfo = {
		path: req.file.path,
		name: req.file.originalname,
		user:req.useremail
	}

	const video = new Video(videoinfo);
	video.save().then(result=>{
		if(!result){
			throw new Error('Video not uploaded !');
		}
		return res.status(201).json({message:'Video file uploaded', status: 201, data: result.ops[0]});
	}).catch(err=>{
		console.log(err);
		return next(err);
	});

};

// method for getting user's videos
const getmedia = (req, res, next) => {
	if(!req.logined){
		const error = new Error('UnAuthorized Access!');
		error.statusCode = 442;
		return next(error);
	}
	Video.fetchvideos(req.useremail).then(videos=>{
		if(!videos && videos.length<=0){
			const error = new Error('No Media found!');
			error.statusCode = 404;
			throw error;
		}
		return res.status(200).json({message: 'Media found!', data: videos, status: 200});
	}).catch(err=>{
		console.log(err);
		return next(err);
	})
};
module.exports = {
	upload: upload,
	getmedia: getmedia
}