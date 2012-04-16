// var appMode = "development";
var appMode = "";
var fbUser = null;

function log(message) {
  if (console && console.log && appMode == "development") {
    console.log('log > ', message);
  }
}

$(document).ready(function() {
	// Open external links in a new window
	hostname = window.location.hostname
	$("a[href^=http]")
	  .not("a[href*='" + hostname + "']")
	  .addClass('link external')
	  .attr('target', '_blank');

  $(".gallery .left-button").click(function(){
    log("clicked left");
    showPrev(".gallery .image");
  });

  $(".gallery .right-button").click(function(){
    log("clicked right");
    showNext(".gallery .image");
  });

  
  // if(appMode == "development")
    appHandleEvent("logout");
});


function appHandleEvent(e) {
  log("appHandleEvent");
  if (e == "login") {
    if (fbUser && fbUser.name) {
      $('#auth-displayname').text(fbUser.name);
    }
    log("logging in");
    $('.if-logged-in').addClass("showing");
    $('.if-logged-out').removeClass("showing");
  } else if (e == "logout") {
    log("logging out");
    $('.if-logged-out').addClass("showing");
    $('.if-logged-in').removeClass("showing");
  }
}

function appLoadForum() {
  // Load posts from group and add them to forum
  FB.api("/175117605866523/feed?limit=1", function(r) {
    $("#cross-you").append("<p>"+r.data[0].description+"</p>");
  });
}
