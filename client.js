var $container = $("#photobanner");
function addImageTimer() {
  var rand = Math.floor(Math.random()*10);
  var randWidth = Math.floor(Math.random()*700);
  $container.append('<img id="theImg" class="item" src="http://lorempixel.com/'+randWidth+'/500/cats/'+rand+'">');
  setTimeout(addImageTimer,4000);
}
addImageTimer();