var rightKey, leftKey, topKey, bottomKey;

$(document).ready(function() {
  //Set up the triggers for the arrow keys
  $(document).keydown(function(e){
    if (e.keyCode == 72 && typeof leftKey === 'function') { 
      leftKey();
    } else if(e.keyCode == 75 && typeof topKey === 'function') { 
      topKey();
    } else if(e.keyCode == 76 && typeof rightKey === 'function') { 
      rightKey();
    } else if(e.keyCode == 74 && typeof bottomKey === 'function') { 
      bottomKey();
    } else {
      // $("#notifications").html("<h1>"+e.keyCode+"</h1>");
    }
  });

  showFirst(".gallery .image")
  showFirst(".gallery .blog")
  showPage("home")
  // $("#notifications h1").first().addClass("showing");
});

function showPage(name) {
  show("#h1-"+name, "#notifications h1")
  show("#"+name, ".feature") 
  if(name == "cross-you")
    appLoadForum();
}

function showNextPage() {
  showNext("#notifications h1")
  showNext(".feature") 
}

function showPrevPage() {
  showPrev("#notifications h1")
  showPrev(".feature") 
}

function hide(klass) {
  var to_hide = $(klass+".showing");
  to_hide.removeClass("showing");
}


function showFirst(klass) {
  hide(klass)
  $(klass).first().addClass("showing");

}

function show(id, klass) {
  hide(klass)
  $(id).addClass("showing");  
}

function showPrev(stor) {
  var to_hide = $(stor+".showing");
  to_hide.removeClass("showing");

  var index = to_hide.index();
  index--;
  if (index < 0)
    index = $(stor).size() - 1;
  var to_show = $(stor).eq(index);

  to_show.addClass("showing");
  return to_show;
}

function showNext(stor) {
  var to_hide = $(stor+".showing");
  to_hide.removeClass("showing");

  var index = to_hide.index();
  index++;
  if (index >= $(stor).size())
    index = 0;
  var to_show = $(stor).eq(index);

  to_show.addClass("showing");
  return to_show;
}

function leftKey() {
  showPrev(".gallery .image");
  showPrev(".gallery .blog");
}

function rightKey() {
  showNext(".gallery .image");
  showNext(".gallery .blog");
}

function topKey() {
  showPrevPage();
}

function bottomKey() {
  showNextPage();
}
