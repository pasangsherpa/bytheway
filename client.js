var ee = new EventEmitter();
ee.addListener('insertImage', insertImageListener);

var $search = $('#search-button');
var $container = $("#photobanner");
var imageQueue = [];

$search.on('click', function() {
  var tags = $('#search-bar').val();
  $.getJSON("http://localhost:3000/images?tags=" + tags)
  .then(function(results) {
    debugger
    console.log(results);
  });
})

// Get initial image set
// Start listening for images.
// start timer to render images.

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':3030');
ws.onmessage = function (event) {
  console.log(event);
  imageQueue.push(event.data);
};


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

// Set Stats
function setStats() {
  $.getJSON("http://localhost:3000/stats")
  .then(function(results) {
    var stats = results[0];
    var total = stats.totalMale + stats.totalFemale;
    var boys = Math.round((stats.totalMale / total) * 100);
    var girls = Math.round((stats.totalFemale / total) * 100);
    var avgAge = Math.round(stats.averageAge * 10) / 10;
    $('#boys-progress').html(boys + "%");
    $('#boys-progress').css("width", boys + "%");
    $('#girls-progress').html(girls + "%");
    $('#girls-progress').css("width", girls + "%");
    $('#average-age').html(avgAge);
    $('#youngest').html(stats.minimumAge);
    $('#oldest').html(stats.maximumAge);
  });
}

// Set Tags
function setTags() {
  $.getJSON("http://localhost:3000/tagstats")
  .then(function(results) {
    var firstTag = results[0];
    var secondTag = results[1];
    var thirdTag = results[2];
    $('#firstTag').html('#' + firstTag._id);
    $('#firstTagCount').html(firstTag.count);
    $('#secondTag').html('#' + secondTag._id);
    $('#secondTagCount').html(secondTag.count);
    $('#thirdTag').html('#' + thirdTag._id);
    $('#thirdTagCount').html(thirdTag.count);
  });
}

$('#stats-button').click(function(evt) {
  evt.preventDefault();
  
  var buttonText = $('#stats-button').html();
  if (buttonText == "Show Stats") {
    setStats();
    setTags();
    $('#stats-button').html("Hide Stats");
    $('#stats').fadeIn();
  } else {
    $('#stats-button').html("Show Stats");
    $('#stats').fadeOut();
  }
});

// function pollTimer() {
//   pollForImages();
//   // setTimeout(pollTimer, 5000);
// }

function insertImage(url) {
  setStats();
  setTags();
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
  var next = imageQueue.pop();
  insertImage(next);
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



