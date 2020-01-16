const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
	req.logined = false;
	const authHeader = req.get('Authorization');
	console.log(authHeader)
	if(!authHeader && req.method != 'OPTIONS'){
		const error = new Error('UnAuthorize Access!');
		error.statusCode = 422;
		return next(error);
	}
	const token = authHeader.split(' ')[1];
	const decodedToken = jwt.verify(token, 'nitinsharmscs');
	console.log(decodedToken);
	req.logined = true;
	req.useremail = decodedToken.useremail;
	next();
};

module.exports = isAuth;