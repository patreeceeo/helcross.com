var rightKey, leftKey, topKey, bottomKey;

$(document).ready(function() {
  //Set up the triggers for the arrow keys
  $(document).keydown(function(e){
    if (e.keyCode == 37 && typeof leftKey === 'function') { 
      leftKey();
    } else if(e.keyCode == 38 && typeof topKey === 'function') { 
      topKey();
    } else if(e.keyCode == 39 && typeof rightKey === 'function') { 
      rightKey();
    } else if(e.keyCode == 40 && typeof bottomKey === 'function') { 
      bottomKey();
    } 
  });

  
});

function show(id, klass) {
  var to_hide = $(klass+".showing");
  console.log(to_hide);
  to_hide.removeClass("showing");
  $(id).addClass("showing");
  
  if($(id).hasClass("scroll")) {
     $(id).jScrollPane(); 
     $(id).focus();
  }
}

function showPrev(stor) {
  var to_hide = $(stor+".showing");
  to_hide.removeClass("showing");

  var index = to_hide.index();
  console.log("hiding "+stor+"["+index+"]");
  index--;
  if (index < 0)
    index = $(stor).size() - 1;
  var to_show = $(stor).eq(index);

  console.log("showing "+stor+"["+index+"]");
  to_show.addClass("showing");
  return to_show;
}

function showNext(stor) {
  var to_hide = $(stor+".showing");
  to_hide.removeClass("showing");

  var index = to_hide.index();
  console.log("hiding "+stor+"["+index+"]");
  index++;
  if (index >= $(stor).size())
    index = 0;
  var to_show = $(stor).eq(index);

  console.log("showing "+stor+"["+index+"]");
  to_show.addClass("showing");
  return to_show;
}

function leftKey() {
  showPrev("#gallery .image");
}

function rightKey() {
  showNext("#gallery .image");
}

function topKey() {
  var el = showPrev("#content .feature");
  if(el.hasClass("scroll")) {
     el.jScrollPane();
     el.focus();
  }
}

function bottomKey() {
  var el = showNext("#content .feature");
  if(el.hasClass("scroll")) {
     el.jScrollPane(); 
     el.focus();
  }
}
