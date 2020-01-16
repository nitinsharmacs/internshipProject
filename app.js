const express = require('express');
const path = require('path');
const app = express();

// importing 3rd party packages
const bodyParser = require('body-parser');
const multer = require('multer');

// importiing routes
const authRoute = require('./routes/auth');
const mediaRoute = require('./routes/media');

// importing auth middleware 
const isAuth = require('./middleware/isAuth');

// importing databaseconnection
const dbConnection = require('./util/database').dbConnection;

app.use((req, res, next)=>{
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	if(req.method == 'OPTIONS'){
		res.status = 200;
	}
	next();
});

// making multer storage
const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './media');
	},
	filename: (req, file, cb) => {
		const date = new Date();
		const fileName = date.getMonth() + date.getTime() + file.originalname;
		cb(null, fileName);
	}
});

// file fileter
const fileFilter = (req, file, cb) => {
	if(file.mimetype == 'video/mp4' || file.mimetype == 'video/mp4a' || file.mimetype == 'video/webm'){
		req.videoValid = true;
		cb(null, true);
	} else {
		req.videoValid = false;
		cb(null, false)
	}
}

let upload = multer({storage: fileStorage, fileFilter: fileFilter});

// making media directory accessible
app.use('/media',express.static(path.join(__dirname, 'media')));

app.use(bodyParser.json());		// bodyparser

app.use('/auth',authRoute);


app.use('/api/media' ,  upload.single('video')  ,mediaRoute);

app.use('/', (req, res, next) =>{
	console.log('Server is working !');
});

app.use((error, req, res, next) => {
	console.log(error.message);
	if(!error.statusCode){
		error.statusCode = 500;
	}
	return res.status(error.statusCode).json({message: error.message, statusCode: error.statusCode});
});

dbConnection((datab)=>{
	app.listen(3001, ()=> {
		console.log('Application is running on 3001');
	});
});

