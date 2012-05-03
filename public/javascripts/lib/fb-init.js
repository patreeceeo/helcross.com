
function log(message) {
  if (console && console.log) {
    console.log('log > ', message);
  }
}

function fbHandleEvent (response) {
  log("fbHandleEvent");
  if (response.authResponse) {
    // user has auth'd your app and is logged into Facebook
    FB.api ('/me', function (me) {
      fbUser = me;
      log("fbUser.name: "+fbUser.name);
      appHandleEvent("login");
    });
  } else {
    appHandleEvent("logout");
    if(FB.getAuthResponse())
      FB.logout(fbHandleEvent);
  }

}

(function(d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) 
    return;
  js = d.createElement('script'); 
  js.id = id; 
  js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
} (document));

// Init the SDK upon load
window.fbAsyncInit = function() {
  log("facebook initializing.");
  FB.init({
    appId      : app_id, // App ID
    channelUrl : app_channelUrl, // Path to your Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true,  // parse XFBML
    oauth      : true
  });

  // listen for and handle auth.statusChange events
  FB.Event.subscribe('auth.statusChange', fbHandleEvent);

  FB.getLoginStatus(fbHandleEvent);
  
  // respond to clicks on the login and logout links
  $('#auth-loginlink').click(function(e) {
    log("clicked login link");
    FB.login(fbHandleEvent);
  });
  $('#auth-logoutlink').click(function(e) {
    log("clicked logout link");
    FB.logout(fbHandleEvent);
  }); 
  renderForum("#forum-page .posts-container");
}

