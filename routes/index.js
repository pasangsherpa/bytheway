var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
var twilio = require('twilio');
var S3 = new AWS.S3();
var gm = require('gm');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/image', function(req, res) {
   // Validate Twilio req
  // if (twilio.validateExpressRequest(req, config.authToken)) {

    console.log(req.body)
    res.send('OK');

  // } else {
  //   return res.send('Nice try imposter.');
  // }
});

module.exports = router;
