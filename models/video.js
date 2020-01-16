const database = require('../util/database').database;


class Video {
	constructor(videoinfo){
		this.videoToSend = {
			path: videoinfo.path,
			name: videoinfo.name,
			user: videoinfo.user
		}
	}

	save(){
		const db = database();
		return db.collection('media').insertOne(this.videoToSend);
	}

	static fetchvideos(useremail){
		console.log(useremail);
		const db = database();
		return db.collection('media').find({user: useremail}).toArray();
	}
}

module.exports = Video;