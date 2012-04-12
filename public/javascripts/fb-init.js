(function(d) {
  var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement('script'); js.id = id; js.async = true;
  js.src = "//connect.facebook.net/en_US/all.js";
  ref.parentNode.insertBefore(js, ref);
} (document));

// Init the SDK upon load
window.fbAsyncInit = function() {
  FB.init({
    appId      : 'YOUR_APP_ID', // App ID
    channelUrl : '//'+window.location.hostname+'/channel', // Path to your Channel File
    status     : true, // check login status
    cookie     : true, // enable cookies to allow the server to access the session
    xfbml      : true  // parse XFBML
  });

// listen for and handle auth.statusChange events
FB.Event.subscribe('auth.statusChange', function(response) {
  if (response.authResponse) {
    // user has auth'd your app and is logged into Facebook
    FB.api('/me', function(me){
      if (me.name) {
        document.getElementById('auth-displayname').innerHTML = me.name;
      }
    })
    document.getElementById('auth-loggedout').style.display = 'none';
    document.getElementById('auth-loggedin').style.display = 'block';
  } else {
    document.getElementById('auth-loggedout').style.display = 'block';
    document.getElementById('auth-loggedin').style.display = 'none';
  }
});
// respond to clicks on the login and logout links
document.getElementById('auth-loginlink').addEventListener('click', function(){
  FB.login();
});
document.getElementById('auth-logoutlink').addEventListener('click', function(){
  FB.logout();
}); 









// window.fbAsyncInit = function() {
//   FB.init({
//     appId      : hc_appId,                     // App ID
//     channelUrl : hc_channelUrl, // Channel File
//     status     : true,                                    // check login status
//     cookie     : true,                                    // enable cookies to allow the server to access the session
//     xfbml      : true                                     // parse XFBML
//   });

//   // Listen to the auth.login which will be called when the user logs in
//   // using the Login button
//   FB.Event.subscribe('auth.login', function(response) {
//     // We want to reload the page now so Ruby can read the cookie that the
//     // Javascript SDK sat. But we don't want to use
//     // window.location.reload() because if this is in a canvas there was a
//     // post made to this page and a reload will trigger a message to the
//     // user asking if they want to send data again.
//     window.location = window.location;
//   });

//   FB.Canvas.setAutoGrow();
// };

// // Load the SDK Asynchronously
// (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) return;
//   js = d.createElement(s); js.id = id;
//   js.src = "//connect.facebook.net/en_US/all.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));
