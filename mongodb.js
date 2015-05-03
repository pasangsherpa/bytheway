//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
exports.insertImage = function insertImage(image, cb){
  var MongoClient = mongodb.MongoClient;
  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://'+process.env.MONGOLABUSER+':'+process.env.MONGOLABPASSWORD+'@ds031822.mongolab.com:31822/bytheway';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // do some work here with the database.
      var collection = db.collection('images');
      collection.insert(image, function(err, result){
        if (err) {
          cb(err);
        } else {
          cb(null, result);
        }
        db.close();
      })      
    }
  })

};

// // DEMO CODE
// insertImage({
//   image: 'http://lorempixel.com/100/400/cats/',
//   phoneNumber: '555555test'
// })

exports.getImages = function getImages(cb) {
  var MongoClient = mongodb.MongoClient;
  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://'+process.env.MONGOLABUSER+':'+process.env.MONGOLABPASSWORD+'@ds031822.mongolab.com:31822/bytheway';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // do some work here with the database.
      var collection = db.collection('images');

      collection.find().toArray(function(err, results){
        if (err) {
          cb(err);
        } else {
          cb(null, results);
        }
        db.close();
      });
    }
  });
}

exports.getImagesWithTag = function getImages(tagsList, cb) {
  var MongoClient = mongodb.MongoClient;
  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://'+process.env.MONGOLABUSER+':'+process.env.MONGOLABPASSWORD+'@ds031822.mongolab.com:31822/bytheway';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // do some work here with the database.
      var collection = db.collection('images');
      collection.find({
          tags: {
              "$in": tagsList
          }
      }).toArray(function(err, results){
        if (err) {
          cb(err);
        } else {
          cb(null, results);
        }
        db.close();
      });
    }
  });
}

exports.getStats = function getStats(cb) {
  var MongoClient = mongodb.MongoClient;
  // Connection URL. This is where your mongodb server is running.
  var url = 'mongodb://'+process.env.MONGOLABUSER+':'+process.env.MONGOLABPASSWORD+'@ds031822.mongolab.com:31822/bytheway';

  // Use connect method to connect to the Server
  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      //HURRAY!! We are connected. :)
      console.log('Connection established to', url);

      // do some work here with the database.
      var collection = db.collection('images');  
      collection.aggregate({
          "$unwind": "$faces"
      }, {
          "$group": {
              "_id": null,
              "averageAge": {
                  "$avg": "$faces.age"
              },
              "maximumAge": {
                  "$max": "$faces.age"
              },
              "minimumAge": {
                  "$min": "$faces.age"
              },
              "total": {
                  "$sum": "$_id"
              },
              "totalMale": {
                  "$sum": {
                    "$cond": [{
                        "$eq": ["$faces.gender", "male"]
                    }, 1, 0]
                  }                
              },
              "totalFemale": {
                  "$sum": {
                    "$cond": [{
                        "$eq": ["$faces.gender", "female"]
                    }, 1, 0]
                  }                
              }
          }
      }, function(err, result) {
        if (err) {
          cb(err);
        } else {
          cb(null, result);
        }
        db.close();
      });
    }
  })
}
