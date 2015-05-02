var express = require('express');
var router = express.Router();
var uploadFile = require('../uploadFile.js');
var AWS = require('aws-sdk');
var twilio = require('twilio');
var AWS = require('aws-sdk');
var S3 = new AWS.S3();
var gm = require('gm');
var mime = require('mime');

router.get('/s3upload', function(req, res, next) {
    uploadFile.sendToS3();
    res.json("Upload success?");
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.post('/image', function(req, res) {
    // Validate Twilio req
    // if (twilio.validateExpressRequest(req, config.authToken)) {

    var image = req.body;
    console.log(req.body);

    var imageName = image.From + '/' + SmsMessageSid + '.jpg';

    gm(request(image.MediaUrl0), imageName)
        .resize('100^', '100^')
        .stream(function(err, stdout, stderr) {
            var data = {
                Bucket: 'bytheway',
                Key: imageName,
                Body: stdout,
                ACL: 'public-read',
                ContentType: mime.lookup(imageName)
            };
            S3.client.putObject(data, function(err, res) {
                console.log('imageName: ' + imageName);
                res.status(200).send('OK');
            });
        });

    // } else {
    //   return res.send('Nice try imposter.');
    // }
});

module.exports = router;
