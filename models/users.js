const database = require('../util/database').database;



class User {
	constructor(userinfo){
		this.userToSend = {
			useremail: userinfo.useremail,
			password: userinfo.password
		}
	}

	save(){
		const db = database();
		return db.collection('users').insertOne(this.userToSend);
	};

	static findByEmail(useremail){
		const db = database();
		return db.collection('users').findOne({useremail: useremail});
	};	

	static updateUser(useremail, whattoupdate, updateData){
		const db = database();
		switch(whattoupdate){
			case 'OTP':
				return db.collection('users').updateOne({useremail: useremail}, {$set:{otp: updateData}});
			case 'PASSWORD':
				return db.collection('users').updateOne({useremail: useremail}, {$set:{password: updateData}});

			default:
				return Promise.resolve(true);
		}
	};
}

module.exports = User;