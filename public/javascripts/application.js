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

function appRenderForumPost(post, stor) {
  // var source = "
  //   {{#post
  //   <div class='post'>
      
  // var t = Handlebars.compile(source);
  // $(stor).append("<p>"+r.data[0].description+"</p>"); 
}

function appRenderForum(forum, stor) {
  var source = "\
    {{#forum.data}}\
      <div class='post'>\
        <h1>{{name}}</h1>\
        <h2>{{from.name}}</h2>\
        <p>{{description}}</p>\
      </div>";
      
  var t = Handlebars.compile(source);
  $(stor).append(t(forum));
}
