function logResponse(response) {
  if (console && console.log) {
    console.log('The response was', response);
  }
}

$(function(){
  // Set up so we handle click on the buttons
  var dataUrl = this.location.href;
  $('#post-to-wall').click(function() {
    FB.ui ({
      method : 'feed',
      link   : dataUrl
      },
    function (response) {
      // If response is null the user canceled the dialog
      if (response != null) {
        logResponse(response);
      }
    }
    );
  });

  $('#send-to-friends').click(function() {
    FB.ui(
      {
      method : 'send',
      link   : dataUrl
    },
    function (response) {
      // If response is null the user canceled the dialog
      if (response != null) {
        logResponse(response);
      }
    }
    );
  });

  $('#app-request').click(function() {
    FB.ui(
      {
      method  : 'apprequests',
      message : dataUrl
    },
    function (response) {
      // If response is null the user canceled the dialog
      if (response != null) {
        logResponse(response);
      }
    }
    );
  });

  $('#add-page-tab').click(function() {
    log("you clicked #add-page-tab");
    FB.ui({
      method: 'pagetab',
      redirect_uri: dataUrl
    },
    function (response) {
      // If response is null the user canceled the dialog
      if (response != null) {
        logResponse(response);
      }
    }); 
  });
});
