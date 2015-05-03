var ee = new EventEmitter();
ee.addListener('insertImage', insertImageListener);

var $container = $("#photobanner");
var imageQueue = [];

// Get initial image set
// Start listening for images.
// start timer to render images.


firstImageLoad();
// setTimeout(pollTimer, 5000);
setTimeout(insertTimer, 5000);

// TODO: Use real URL and schema
function firstImageLoad() {
  $.getJSON("http://localhost:3000/images")
  .then(function(results) {
    results.forEach(function(result) {
      imageQueue.push(result.image);
    });
    ee.emit('insertImage');
  });
}

// function pollTimer() {
//   pollForImages();
//   // setTimeout(pollTimer, 5000);
// }

function insertImage(url) {
  var tmpImage = $("<img/>");
  tmpImage.load(function() {
    var naturalWidth = tmpImage[0].naturalWidth;
    var $newImageContainer = $('<paper-shadow z="3" class="item span-shadow" style="height:0px; border:1px solid black; width:' + naturalWidth + 'px"></paper-shadow>');
    $container.prepend($newImageContainer);
    $newImageContainer.animate({height: "500px"}, 500, function() {
      $newImageContainer.html(tmpImage);
    });

  }).attr("src", url);
}

function insertImageListener() {
  console.log('The insertImage event has been emitted.');
  updateStats();
  var next = imageQueue.pop();
  insertImage(next);
}

function updateStats() {
  $.getJSON("http://localhost:3000/stats")
  .then(function(results) {
    //find by id and update numbers
    console.log(results);
  });
}

function insertTimer() {
  renderedImages = $(".item");
  if (isQueueEmpty() && renderedImages.length > 0) {
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

function isQueueEmpty() {return imageQueue.length === 0; }

function popLastPhoto() {
  var items = $(".item");
  var last = items[items.length - 1];
  var src = $(last).children()[0].src;
  $(last).remove();
  return src;
}



