function fbHandleEvent (response) {
  log("fbHandleEvent");
  if (response.authResponse) {
    // user has auth'd your app and is logged into Facebook
    FB.api ('/me', function (me) {
      fbUser = me;
    });
    appHandleEvent("login");
  } else {
    appHandleEvent("logout");
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
  FB.init({
    appId      : app_id, // App ID
    channelUrl : app_channelUrl, // Path to your Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

  // listen for and handle auth.statusChange events
  FB.Event.subscribe('auth.statusChange', fbHandleEvent);

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

  // fbUpdateLoginStatus();
}

// function fbUpdateLoginStatus() {
//   FB.getLoginStatus(function(response) {
//     if (response.status == 'connected') {
//       var uid = response.authResponse.userID;
//       var accessToken = response.authResponse.accessToken;
//       appHandleEvent("login");
//     } else if (response.status == 'not_authorized') {

//       appHandleEvent("logout");
//     } else {
//       appHandleEvent("logout");
//     }
//   });
// }

