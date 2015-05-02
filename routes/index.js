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
var db = require('../mongodb');

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
    if (twilio.validateExpressRequest(req, process.env.TWILIO_TOKEN)) {
        var image = req.body;
        var imageName = image.From.replace('+', '') + '/' + image.SmsMessageSid + '.jpg';

        gm(request(image.MediaUrl0), imageName)
            .resize(null, 500)
            .compress('Lossless')
            .noProfile()
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
                        db.insertImage({
                            image: 'https://s3.amazonaws.com/disruptny/' + imageName,
                            phoneNumber: image.From
                        });
                        res.status(200).send('OK');
                    });
                });
            });
    } else {
        return res.send('Nice try imposter.');
    }
});

module.exports = router;
