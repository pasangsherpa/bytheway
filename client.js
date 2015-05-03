var ee = new EventEmitter();
ee.addListener('insertImage', insertImageListener);

var $container = $("#photobanner");
var imageQueue = [];

pollTimer();
// setTimeout(pollTimer, 5000);
setTimeout(insertTimer, 5000);

// TODO: Use real URL and schema
function pollForImages() {
  $.getJSON('http://localhost:3000/images')
  .then(function(results) {
    console.log(results);
    results.forEach(function(result) {
      imageQueue.push(result.image);
    });
  });
}

function pollTimer() {
  pollForImages();
  // setTimeout(pollTimer, 5000);
}

function insertImage(url) {
  var tmpImage = $('<img/>');
  tmpImage.load(function() {
    var naturalWidth = tmpImage[0].naturalWidth;
    var $newImageContainer = $('<paper-shadow z="3" class="item span-shadow" style="height:0px; border:1px solid black; width:'+naturalWidth+'px"></paper-shadow>');
    $container.prepend($newImageContainer);
    $newImageContainer.animate({height: "500px"}, 500, function() {
      $newImageContainer.html(tmpImage);
    });
    
  }).attr('src', url);



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



