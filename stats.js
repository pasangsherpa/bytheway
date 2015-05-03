$('#stats-button').click(function() {
  console.log("Hello world");
  
  var buttonText = $('#stats-button').html();
  if (buttonText == "Show Stats") {
    $('#stats-button').html("Hide Stats");
    $('#stats').append('Boys: 80% <br> Girls: 20% <br> Youngest: 16 <br> Oldest: 64 <br> Average Age: 36');
  } else {
    $('#stats-button').html("Show Stats");
    $('#stats').html('');
  }
});