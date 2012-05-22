var fbUser = null;

if(console) {
  console.__log = console.log;
  console.log = undefined;
  console.__warn = console.warn;
  console.warn = undefined;
  console.__error = console.error;
  console.error = undefined;
} else {
  console = {}
  console.__log = console.__warn = console.__error = function () {}
}

function log (msg) {
  console.__log(msg);
}

function warn (msg) {
  console.__warn(msg);
}

function error (msg) {
  console.__error(msg);
}

function makeExternalLinksOpenInNewWindow(root_stor) {
	var hostname = window.location.hostname
  $(root_stor+" a[href^=http]")
    .not("a[href*='" + hostname + "']")
    .addClass('link external')
    .attr('target', '_blank');
}

function stripeResponseHandler(status, response) {
  if (response.error) {
    // show the errors on the form
    $(".payment-errors").text(response.error.message);
  } else {
    var form$ = $("#payment-form");
    // token contains id, last4, and card type
    var token = response['id'];
    // insert the token into the form so it gets submitted to the server
    form$.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
    // and submit
    form$.get(0).submit();
  }
}

$(document).ready(function() {
	// Open external links in a new window
  makeExternalLinksOpenInNewWindow("");

  $(".carousel").carousel()

  $("#home-carousel img").click(function(e) {
    var el = $("#home-carousel");
    if(el.hasClass("expanded")) {
      unexpand(el);
    } else {
      expand(el, 550, 660);
    }

  });

  $("textarea").autosize();

  Modernizr.load([{
    test: Modernizr.input.placeholder,
    nope: "javascripts/lib/jquery.html5form-1.5-min.js",
    complete: function () {
      if($("form").html5form)
        $("form").html5form();
    }
  }]);

  $(".store-item .on-hover").mouseover(function(e) {
    $(this).addClass("hovering");
  });

  $(".store-item .on-hover").mouseout(function(e) {
    $(this).removeClass("hovering");
  });

  function addToCartCallback(data) {
  }

  $(".store-item").click(function(e) {
    var id = $(this).attr("data-item-id");
    log(id);
    $.post("/cart", {action: "add", id: id}, function (data) {
      log("response: "+data["message"]);
    }, "json");
  });



  // Create Stripe single-use token
  $("#payment-form").submit(function(event) {
    // disable the submit button to prevent repeated clicks
    $('.submit-button').attr("disabled", "disabled");
    Stripe.createToken({
      number: $('.card-number').val(),
      cvc: $('.card-cvc').val(),
      exp_month: $('.card-expiry-month').val(),
      exp_year: $('.card-expiry-year').val()
    }, stripeResponseHandler);
    // prevent the form from submitting with the default action
    return false;
  });


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

function bump(thing, type, with_class) {
  var things = $("[id$='"+type+"']");
  if(things.size() == 0) {
    error("There's no elements with ids ending in "+type+" in this document.");
    return;
  }
  things.each(function(i, el) {
    $(el).removeClass(with_class);
  });
  var el = $("#"+thing+"-"+type);
  if(el.size() == 0) {
    error("There's no element with id \""+thing+"-"+type+"\".");
    return;
  }
  $("#"+thing+"-"+type).addClass(with_class);
}

function showPage(page) {
  bump(page, "page", "showing");
  bump(page, "nav", "active");
}

function expand(el, h, w) {
  var left = el.offset().left;
  var top = el.offset().top;
  var ww = $(this).width();
  var wh = $(this).height();
  el.addClass("expanding");
  el.css("left", (ww-w)/2-left+"px");
  el.css("top", (wh-h)/2-top+"px");
  el.css("width", w);
  el.css("height", h);
  el.removeClass("expanding");
  el.addClass("expanded");
}

function unexpand(el) {
  el.addClass("expanding");
  el.css("width", "inherit");
  el.css("height", "inherit");
  el.css("left", "0");
  el.css("top", "0");
  el.removeClass("expanding");
  el.removeClass("expanded");
}


// Handlebars.registerHelper('post', function(items, options) {
//   var before_each = "<div class='post'>";
//   var after_each = "</div>";
//   var out = "";
//   for (var i=0; i < items.length; i++) {
//     var item = items[i];
//     out += before_each + options.fn(items[i]) + after_each;
//   }
//   return out;
// });

// Handlebars.registerHelper('if-video', function(type, options) {
//   if(type == "video") {
//     return options.fn(this);
//   }
// });

// Handlebars.registerHelper('subpost', function(items, options) {
//   var before_each = "<div class='subpost'>";
//   var after_each = "</div>";
//   var out = "";
//   for (var i=0; i < items.length; i++) {
//     out += before_each + options.fn(items[i]) + after_each;
//   }
//   return out;
// });

// Handlebars.registerHelper('primary-actor', function(actor, options) {
//   getPicture(actor.id, "normal", function(picture) {
//     $("#fboid_"+actor.id+"_normal").attr("src", picture); 
//   });
//   return "<div class='primary-actor'><img id='fboid_"+actor.id+"_normal' src=\"\"/>"+actor.name+"</div>";
// });

// Handlebars.registerHelper('reactor', function(actor, options) {
//   getPicture(actor.id, "small", function(picture) {
//     $("#fboid_"+actor.id+"_small").attr("src", picture); 
//   });
//   return "<div class='reactor'><img id='fboid_"+actor.id+"_small' src=\"\"/>"+actor.name+"</div>";
// });
  
// Handlebars.registerHelper('likes', function(items, options) {
//   return "";
// });

// function getForum(callback) {
//   FB.api("/175117605866523/feed?limit=1&access_token=368471183197357|eCJFFVks1PDmkjSI-g7G9QqGe5w", function(r) {
//     callback(r);
//   });
// }

// function getPicture(id, type, callback) {
//   log("getPicture");
//   var cbr;
//   FB.api("/"+id+"/picture?type="+type, function(r) {
//     cbr = callback(r);
//     log("cbr = " + cbr);
//     return cbr;
//   });
// }

// function renderForum(stor) {
//   var source = $("#forum-post-template").html();      
//   log(test_forum_data);
//   var t = Handlebars.compile(source);
//   $(stor).empty();
//   $(stor).append(t(test_forum_data));
//   makeExternalLinksOpenInNewWindow(stor);
//   // register callbacks
//   $(".post .video-container .video-preview").click(function(e) {
//     $(e.currentTarget).parent().addClass("active");
//   });
// }
  
//   // FB.api("/175117605866523/feed?limit=10&access_token=368471183197357|eCJFFVks1PDmkjSI-g7G9QqGe5w", function(forum) { log(JSON.stringify(forum)); });


// function logResponse(response) {
//   log('The response was', response);
// }

// $(function() {
//   // Set up so we handle click on the buttons
//   var dataUrl = this.location.href;
//   $('#post-to-wall').click(function() {
//     FB.ui ({
//       method : 'feed',
//       link   : dataUrl
//       },
//     function (response) {
//       // If response is null the user canceled the dialog
//       if (response != null) {
//         logResponse(response);
//       }
//     }
//     );
//   });

//   $('#send-to-friends').click(function() {
//     FB.ui(
//       {
//       method : 'send',
//       link   : dataUrl
//     },
//     function (response) {
//       // If response is null the user canceled the dialog
//       if (response != null) {
//         logResponse(response);
//       }
//     }
//     );
//   });

//   $('#app-request').click(function() {
//     FB.ui(
//       {
//       method  : 'apprequests',
//       message : dataUrl
//     },
//     function (response) {
//       // If response is null the user canceled the dialog
//       if (response != null) {
//         logResponse(response);
//       }
//     }
//     );
//   });

//   $('#add-page-tab').click(function() {
//     log("you clicked #add-page-tab");
//     FB.ui({
//       method: 'pagetab',
//       redirect_uri: dataUrl
//     },
//     function (response) {
//       // If response is null the user canceled the dialog
//       if (response != null) {
//         logResponse(response);
//       }
//     }); 
//   });
// });



