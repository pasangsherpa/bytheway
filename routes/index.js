var express = require('express');
var router = express.Router();
var uploadFile = require('../uploadFile.js');
var request = require('request');
var AWS = require('aws-sdk');
var twilio = require('twilio');
var AWS = require('aws-sdk');
var S3 = new AWS.S3();
var gm = require('gm').subClass({
    imageMagick: true
});
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
    // var image = {
    //     "SmsMessageSid": "aksjhdflkjhasdf",
    //     "From": "+12062526252",
    //     "MediaUrl0": "http://www.vetprofessionals.com/catprofessional/images/home-cat.jpg"
    // }
    console.log(req.body);

    var imageName = image.From + '/' + image.SmsMessageSid + '.jpg';

    // request(image.MediaUrl0).pipe(res);

    gm(request(image.MediaUrl0), imageName)
        .resize(400, 400)
        .stream(function(err, stdout, stderr) {
            if (err) console.log(err);
            var buf = new Buffer('');
            stdout.on('data', function(data) {
                buf = Buffer.concat([buf, data]);
            });
            stdout.on('end', function() {
                var data = {
                    Bucket: 'disruptny',
                    Key: imageName,
                    Body: buf,
                    ACL: 'public-read',
                    ContentType: mime.lookup(imageName)
                };
                S3.putObject(data, function(err, response) {
                    if (err) console.log(err);
                    console.log('imageName: ' + imageName);
                    res.status(200).send('OK');
                });
            });
        });

    // } else {
    //   return res.send('Nice try imposter.');
    // }
});

module.exports = router;
