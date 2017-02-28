
// Swipe
$(document).ready(function() {

  $("#bookshelf_slider").bind("touchstart", TouchStart);
  $("#bookshelf_slider").bind("mousedown", TouchStart);
  $("#bookshelf_slider").bind("touchend", TouchEnd);
  $("#bookshelf_slider").bind("mouseup", TouchEnd);

});
function TouchStart( event ) {
  var x = event.pageX;
  xtouchPositionX = (x == undefined )?event.changedTouches[0].pageX:x;
  $("#bookshelf_slider").data("postionx",xtouchPositionX);
}
function TouchEnd( event ) {
  var x = event.pageX;
  x = (x == undefined )?event.changedTouches[0].pageX:x;
  touchPositionX = $("#bookshelf_slider").data("postionx");

  var movePixcel = touchPositionX - x;
  $("#bookshelf_slider").data("postionx",-1);

  // どれだけ動いたか
  if(Math.abs(movePixcel) < 150)return ;
  if(movePixcel > 0){
    return nextPage();
  }else{
    return prePage();
  }
}
