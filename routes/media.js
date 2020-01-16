const express = require('express');

const router = express.Router();

const isAuth = require('../middleware/isAuth');
// importing media Controller
const mediaController = require('../controllers/media');

router.post('/upload',isAuth ,mediaController.upload);

router.get('/getmedia', isAuth, mediaController.getmedia);

module.exports = router;