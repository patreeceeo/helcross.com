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

function appRenderForum(stor) {
  // {{#name}}\
  //   <h1 class='prepend-2'>{{name}}</h1>\
  //   {{/name}}\
  var source = "\
    {{#data}}\
      <div class='post span-18'>\
        <div class='row'>\
          {{#message}}\
          {{/message}}\
          {{#picture}}\
          <a href='#' class='span-4 prepend-2 image'>\
            <img src='{{picture}}' />\
          </a>\
          <div class='span-12 last'>\
            {{description}}\
          </div>\
          {{/picture}}\
          {{^picture}}\
          <div class='span-12 last'>\
            {{description}}\
          </div>\
          {{/picture}}\
        </div>\
      </div>\
    {{/data}}";
      
  var t = Handlebars.compile(source);
  $(stor).empty();
  // FB.api("/175117605866523/feed?limit=10&access_token=368471183197357|eCJFFVks1PDmkjSI-g7G9QqGe5w", function(forum) {
  var forum = { // dummy data
      "data": [{
        "id": "175117605866523_374829559228659", 
        "from": {
            "name": "Kristian Gore", 
            "id": "100000397654007"
        }, 
        "to": {
            "data": [
                {
                  "version": 1, 
                  "name": "Hel +", 
                  "id": "175117605866523"
                }
              ]
        }, 
        "picture": "/content/images/me.jpg", 
        "link": "#", 
        "source": "#", 
        "name": "Point w/ Steve Oh: F*D Justice System Episode", 
        "caption": "www.youtube.com", 
        "description": "Should the United States end the death penalty? How many false convictions come from eyewitness testimony, police lineups, and even DNA evidence? When will w...", 
        "icon": "http://static.ak.fbcdn.net/rsrc.php/v1/yj/r/v2OnaTyTQZE.gif", 
        "type": "video", 
        "created_time": "2012-04-16T13:29:39+0000", 
        "updated_time": "2012-04-16T13:29:39+0000", 
        "comments": {
            "count": 0
        }
      },
      {
        "id": "175117605866523_374829559228659", 
        "from": {
            "name": "Kristian Gore", 
            "id": "100000397654007"
        }, 
        "to": {
            "data": [
                {
                  "version": 1, 
                  "name": "Hel +", 
                  "id": "175117605866523"
                }
              ]
        }, 
        "picture": "/content/images/me.jpg", 
        "link": "#", 
        "source": "#", 
        "name": "Point w/ Steve Oh: F*D Justice System Episode", 
        "caption": "www.youtube.com", 
        "description": "The next one.", 
        "icon": "http://static.ak.fbcdn.net/rsrc.php/v1/yj/r/v2OnaTyTQZE.gif", 
        "type": "video", 
        "created_time": "2012-04-16T13:29:39+0000", 
        "updated_time": "2012-04-16T13:29:39+0000", 
        "comments": {
            "count": 0
          }
        }],
      "paging": {
        "previous": "#", 
        "next": "#"
      } 
    };
  $(stor).append(t(forum));
    // });
}
