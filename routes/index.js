var express = require('express');
var router = express.Router();
var request = require('request');
var async = require('async');
var _ = require('lodash');

var twilio = require('twilio');
var AWS = require('aws-sdk');
var S3 = new AWS.S3();
var mime = require('mime');
var gm = require('gm').subClass({
    imageMagick: true
});

var db = require('../mongodb');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/images', function(req, res) {
    var tags = req.query.tags;
    console.log(tags)
    if (tags) {
        db.getImagesWithTag(tags.split(','), function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    } else {
        db.getImages(function(err, results) {
            if (err) {
                res.send(err);
            } else {
                res.json(results);
            }
        });
    }
});


/* Twilio incoming */
router.post('/image', function(req, res) {
    // Validate Twilio req
    if (twilio.validateExpressRequest(req, process.env.TWILIO_TOKEN)) {
        var image = req.body;
        if (!image.MediaUrl0) {
            return res.send('No image found.');
        }

        var imageName = image.From.replace('+', '') + '/' + image.SmsMessageSid + '.jpg';
        var tags = image.Body ? image.Body.toLowerCase().split(' ') : ['notag'];

        imageDetails = {
            image: 'https://s3.amazonaws.com/disruptny/' + imageName,
            phoneNumber: image.From,
            tags: tags
        }

        async.auto({
            getFaceDetails: function(callback){
                request.post({
                    url: 'https://api.projectoxford.ai/face/v0/detections',
                    headers: {
                        'content-type': 'application/json'
                    },
                    qs: {
                        'subscription-key': process.env.FACE_API_KEY,
                        analyzesFaceLandmarks: false,
                        analyzesAge: true,
                        analyzesGender: true
                    },
                    body: '{"url":"' + image.MediaUrl0 + '"}'        
                }, function(err, response, body) {
                    if (err) return callback(err);
                    else {
                        callback(null, body);
                    }
                });
            },
            saveToS3: function(callback){
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
                                if (err) return callback(err);
                                else callback(null);
                            });
                        });
                    });
            },
            saveToMongo: ['getFaceDetails', 'saveToS3', function(callback, results){
                var faceDetails = results.getFaceDetails;
                if (faceDetails) {
                    imageDetails.faces = _.pluck(JSON.parse(faceDetails), 'attributes');
                }
                db.insertImage(imageDetails, function(err, result){
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            }]
        }, function(err, results) {
            res.send();
        });

    } else {
        return res.send('Nice try imposter.');
    }
});

router.get('/stats', function(req, res) {
    db.getStats(function(err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
