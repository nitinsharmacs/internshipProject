const express = require('express');
const router = express.Router();

// importing 3rd party packages
const { body } = require('express-validator/check');

// importing authController
const authController = require('../controllers/auth');

router.post('/signup', [body('useremail', 'Invalid Email !').isEmail(), body('password', 'Password must has atleast minimum 5 letters !').trim().isLength({min:5})] , authController.signup);	// route for signup

router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotpassword);

router.post('/newpassword', [body('useremail', 'Invalid Email!').isEmail(), body('password', 'Password must has atleas minimum 5 letters').trim().isLength({min:5})] ,authController.newpassword);

module.exports = router;