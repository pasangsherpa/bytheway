var ee = new EventEmitter();
ee.addListener('insertImage', insertImageListener);

var $container = $("#photobanner");
var imageQueue = [
  "http://lorempixel.com/344/233/cats/10/",
  "http://lorempixel.com/344/233/cats/1/",
  "http://lorempixel.com/344/233/cats/2/"
];

setTimeout(insertTimer, 5000);
setTimeout(pollTimer, 5000);

// TODO: Use real URL and schema
function pollForImages() {
  $.getJSON('someURLhere')
  .then(function(results) {
    results.forEach(function(result) {
      imageQueue.push(result.url);
    });
  });
}

function pollTimer() {
  pollForImages();
  setTimeout(pollTimer, 5000);
}

function insertImage(url) {
  var $newImageContainer = $('<div class="item" style="height:0px; border:1px solid black; width:344px"></div>');
  $container.prepend($newImageContainer);
  $newImageContainer.animate({height: "233px"}, 500, function() {
    var $newImage = $('<img src="'+url+'" style="display:none"/>');
    $newImageContainer.html($newImage);
    $newImage.fadeIn("fast");
  });

}


function insertImageListener() {
  console.log('The insertImage event has been emitted.');
  var next = imageQueue.pop();
  insertImage(next);
}

function insertTimer() {
  if (isQueueEmpty()) {
    var lastImageSrc = popLastPhoto();
    imageQueue.push(lastImageSrc);
    ee.emit('insertImage');
    setTimeout(insertTimer,5000);
    // grab some photos from the end and insert them
  } else {
    ee.emit('insertImage');
    setTimeout(insertTimer,5000);
  }
}



function isQueueEmpty() {return imageQueue.length === 0}

function popLastPhoto() {
  var items = $(".item");
  var last = items[items.length - 1];
  var src = $(last).children()[0].src;
  $(last).remove();
  return src;
}



