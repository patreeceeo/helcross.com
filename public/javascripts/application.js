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

jQuery.extend({
  random: function(X) {
    return X * Math.random();
  },
  randomBetween: function(MinV, MaxV) {
    return MinV + jQuery.random(MaxV - MinV + 1);
  }
});

var cart;

$(document).ready(function() {
	// Open external links in a new window
  makeExternalLinksOpenInNewWindow("");

  // $("[id$='page']").hide();

  $(".if-error").hide();

  $(".carousel").carousel()

  // $("#home-carousel img").click(function(e) {
  //   var el = $("#home-carousel");
  //   if(el.hasClass("expanded")) {
  //     unexpand(el);
  //   } else {
  //     expand(el, 550, 660);
  //   }

  // });

  Modernizr.load([{
    test: Modernizr.input.placeholder,
    nope: "javascripts/lib/jquery.html5form-1.5-min.js",
    complete: function () {
      if($("form").html5form)
        $("form").html5form();
    }
  }]);

  $("textarea").autosize("form-carefree");

  $.each($("#home-operand-container em"), function(idx, el) {
    $(el).css("font-size", $.randomBetween(1, 2) + "em");
  });

  cart = {
    count: 0,
    total: 0,
    contents: {},
    ingest: function(data) {
      var count = data["count"]
      var total = data["total"]
      if(typeof count == "number") 
        cart.count = count;
      if(typeof total == "number") 
        cart.total = total; 
      cart.publishChanges();
      cart.contents = data["item"];
    },
    refresh: function(data) {
      $.getJSON('/cart', {}, function(data) {
        cart.ingest(data)
      })
      cart.showTip = true;
    },
    publishChanges: function () {  
      $("#shopping-cart-bar").addClass("visible");
      $("#shopping-cart-count").text(cart.count);
      $("#shopping-cart-total").text("$"+cart.total);
      if(parseInt(cart.count) == 0) {
        $(".if-shopping-cart-not-empty").hide();
        $(".if-shopping-cart-empty").show();
      } else {
        $("#shopping-cart-bar").tooltip("show");
        window.setTimeout(function () {
          $("#shopping-cart-bar").tooltip("hide");
        }, 2000);

        $(".if-shopping-cart-not-empty").show();
        $(".if-shopping-cart-empty").hide();
      }
    }

  }

  $(".store-item .on-hover").mouseover(function(e) {
    $(this).addClass("hovering");
  });

  $(".store-item .on-hover").mouseout(function(e) {
    $(this).removeClass("hovering");
  });

  $(".store-item .img-wrapper").click(function(e) {
    // var group_id = $(this).attr("data-group-id");
    var control_group_el = $(this).parent().find(".control-group");
    var item_ids = $(this).parent().find("select").val(); 
    log(item_ids);
    if(item_ids !== null && item_ids.length > 0) {
      control_group_el.removeClass("error");
      control_group_el.find(".if-error").hide();
      $.post("/cart", {action: "add", ids: item_ids}, function (data) {
        cart.ingest(data);
      }, "json");
    } else {
      control_group_el.addClass("error");
      control_group_el.find(".if-error").show('fast');
    }

  });

  $("#shopping-cart-bar").tooltip({placement: "bottom", trigger: "hover", delay: {show:600, hide: 600}});

  // $("#shopping-cart-bar").mouseover(function(e) {
  //   $(this).tooltip('hide');
  // });

  $("#shopping-cart-bar").click(function(e) {
    var el = $("#shopping-cart-contents tbody");
    el.empty();
    for(id in cart.contents) {
      var name = cart.contents[id]["name"];
      var count = cart.contents[id]["count"];
      var price = count * cart.contents[id]["price"];
      el.append("<tr><td>"+name+"</td><td>"+count+"</td><td>$"+price+"</td></tr>");
    }
    // show total at bottom
    el.append("<tr><td><em>total</em></td><td>"+cart.count+"</td><td>$"+cart.total+"</td></tr>");
  }); 

  $("#empty-shopping-cart-button").click(function(e) {
    $.post("/cart", {action: "empty"}, function (data) {
      cart.ingest(data);
    }, "json");
  });

  // Create Stripe single-use token
  $("#payment-form").submit(function(event) {
    // disable the submit button to prevent repeated clicks
    $('.submit-button').attr("disabled", "disabled");

    var cvc = $('.card-cvc').val();
    if(!Stripe.validateCVC(cvc)) {
      log("cvs is wrong");
      $(".card-cvc-container").addClass("error");
      $(".card-cvc-container .if-error").show("fast");
    } else Stripe.createToken({
      number: $('.card-number').val(),
      cvc: $('.card-cvc').val(),
      exp_month: $('.card-expiry-month').val(),
      exp_year: $('.card-expiry-year').val(),
      // optional stuff:
      name: $('.cardholder-name').val(),
      address_line_1: $('.cardholder-address1').val(),
      address_line_2: $('.cardholder-address2').val(),
      address_state: $('cardholder-state').val(),
      address_zip: $('cardholder-zip').val(),
      address_country: $('cardholder-country').val()
    }, function (status, response) {
      log(response);
      if (response.error) {
        // show the errors on the form
        // $(".payment-errors").text(response.error.message);
        if(response.error.code == "incorrect_number") {
          $(".card-number-container").addClass("error");
          $(".card-number-container .if-error").show("fast");
        } else if (response.error.code == "invalid_expiry_year") {
          $(".card-expiry-container").addClass("error");
          $(".card-expiry-container .if-error").show("fast");
        }

        log(response.error.message);
      } else {
        var form$ = $("#payment-form");
        // token contains id, last4, and card type
        var token = response['id'];
        // insert the token into the form so it gets submitted to the server
        form$.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        // and submit
        var formData = form$.serialize();
        $.post("/cart/checkout", formData, function(data) {
          if(data.failure_message) 
            $(".payment-errors").text(data.failure_message);
          else {
            log("no errors in payment processing!");
            cart.refresh()
            $("#shopping-cart-modal").modal('hide');
            $("#payment-thanks").text("Thanks "+data.card.name+"!");
            $("#payment-success-modal").modal('show');
          }
        }, "json")
      }
    });

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



