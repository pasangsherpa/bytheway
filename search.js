$('#search-button').click(function(evt) {
  evt.preventDefault();
  
  var val = $('#search-bar').html();
  console.log(val + "worked");
  $('#search-bar').html.clear;

  return false;
});