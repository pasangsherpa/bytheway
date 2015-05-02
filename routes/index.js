var express = require('express');
var router = express.Router();
var uploadFile = require('../uploadFile.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.json("HELLO");
});

router.get('/s3upload', function(req, res, next) {
	uploadFile.sendToS3();
	res.json("Upload success?");
});

module.exports = router;
