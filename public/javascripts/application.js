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
    // showPrev(".gallery .image");
    leftKey();
  });

  $(".gallery .right-button").click(function(){
    log("clicked right");
    // showNext(".gallery .image");
    rightKey();
  });

  
  if(appMode == "development") {
    appHandleEvent("login");
    showPage("cross-you");
  } else {
    appHandleEvent("logout");
    showPage("home");
  }

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

function appRenderForum(forum, stor) {
  console.log("hello...");
  var source = "\
    {{#data}}\
      <div class='post span-18'>\
        <div class='row'>\
          <h1 class='prepend-2'>{{name}}</h1>\
          <a href='#' class='span-6 prepend-2 image'>\
            <img src='{{picture}}' />\
          </a>\
          <div class='span-10 last'>\
            <h2>{{from.name}}</h2>\
            {{description}}\
          </div>\
        </div>\
      </div>\
    {{/data}}";
      
  var t = Handlebars.compile(source);
  $(stor).empty();
  $(stor).append(t(forum));
}
