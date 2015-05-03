
var $container = $("#photobanner");

var imageQueue = [
  "http://lorempixel.com/344/233/cats/10/",
  "http://lorempixel.com/344/233/cats/1/",
  "http://lorempixel.com/344/233/cats/2/"
];

// 1. insert blank div with height 0 above the rest
// 2. grow its height to the height of the new image
// 3. fade in the image

function insertImage(url) {
  var $newImageContainer = $('<div style="height:0px; border:1px solid black; width:344px"></div>');
  $container.prepend($newImageContainer);
  $newImageContainer.animate({height: "233px"}, 500, function() {
    var $newImage = $('<img src="'+url+'" style="display:none"/>');
    $newImageContainer.html($newImage);
    $newImage.fadeIn("fast");
  });

}

// while (imageQueue.length > 1) {
//   var next = imageQueue.pop();
//   (function() {
//     setTimeout(function() {
//       insertImage(next);
//     }, 2000);
//   })();

// }

var ee = new EventEmitter();

function insertImageListener() {
  console.log('The insertImage event has been emitted.');
  var next = imageQueue.pop();
  insertImage(next);
}

function insertTimer() {
  ee.emit('insertImage');
  setTimeout(insertTimer,5000);
}

setTimeout(insertTimer, 5000);

ee.addListener('insertImage', insertImageListener);

function isQueueEmpty() {return imageQueue.length === 0}





