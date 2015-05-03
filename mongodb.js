//lets require/import the mongodb native drivers.
var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
exports.insertImage = function insertImage(image){
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
          console.log(err);
        } else {
          console.log('Successfully inserted image');
          // console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
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
          console.log(results); // output all records
          cb(null, results);
        }
        db.close();
      });
    }
  });
}