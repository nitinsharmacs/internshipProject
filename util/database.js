const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

let _db;
const dbConnection = (cb) => {
	MongoClient.connect('mongodb://127.0.0.1:27017').then(client=>{
		_db = client.db('internship');
		return cb(_db);
	}).catch(err=>{
		_db = err;
		return cb(_db);
	});
};

const database = () => {
	if(_db){
		return _db;
	}

};

exports.dbConnection = dbConnection;
exports.database = database;