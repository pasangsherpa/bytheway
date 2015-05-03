$('#search-button').click(function(evt) {
  evt.preventDefault();
  
  var val = $('#search-bar').val();
  console.log(val);
  $('#search-bar').html('');
});