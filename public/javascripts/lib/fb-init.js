function fbHandleEvent (response) {
  log("fbHandleEvent");
  if (response.authResponse) {
    // user has auth'd your app and is logged into Facebook
    FB.api ('/me', function (me) {
      fbUser = me;
    });
  log("fbUser: ", fbUser);
  appHandleEvent("login");
  } else {
    // if(!response.session) {
    appHandleEvent("logout");
    // }
    // FB.logout(fbHandleEvent);
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
    xfbml      : true  // parse XFBML
  });

  // listen for and handle auth.statusChange events
  FB.Event.subscribe('auth.statusChange', fbHandleEvent);

  FB.getLoginStatus(fbHandleEvent);
  
  // respond to clicks on the login and logout links
  $('#auth-loginlink').click(function(e) {
    if(appMode == "development") {
      appHandleEvent("login");
    } else
      FB.login();
  });
  $('#auth-logoutlink').click(function(e) {
    if(appMode == "development")
      appHandleEvent("logout");
    else
      FB.logout();
  }); 

}

