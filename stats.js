$('#stats-button').click(function(evt) {
  evt.preventDefault();
  
  var buttonText = $('#stats-button').html();
  if (buttonText == "Show Stats") {
    $('#stats-button').html("Hide Stats");
    $('#stats').fadeIn();
  } else {
    $('#stats-button').html("Show Stats");
    $('#stats').fadeOut();
  }
});