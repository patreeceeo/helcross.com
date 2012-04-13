$(document).ready(function() {

	// Open external links in a new window
	hostname = window.location.hostname
	$("a[href^=http]")
	  .not("a[href*='" + hostname + "']")
	  .addClass('link external')
	  .attr('target', '_blank');

  console.log($("#gallery .left-button"));
  $("#gallery .left-button").click(function(){
    console.log("clicked left");
    showPrev("#gallery .image");
  });
  $("#gallery .right-button").click(function(){
    console.log("clicked right");
    showNext("#gallery .image");
  });

});


