
function refleshPageBar(page){
  if($("#pagebar").html()==""){
    for(var i = 1 ; i <= total_page;i++){
      var html ="";
      html += "<a id='jumpPage'";
      html += " page='" + i + "' ";
      html += ">"+i;
      html += "</a>";


      $("#pagebar").append(html);
    }
  }

  // 現在のページに印を入れる。
  $("#pagebar").children().each(function (i,pageitem){
    // リセット
    $(pageitem).removeAttr("selected");
    if(page == i + 1){
      $(pageitem).attr("selected",'selected');
    }
  });
}
function appendInformation(isbn,asin,title,author,imgsrc){
  var html = "";
  html += "<div class='product' data-type='book' data-popup='false' style='text-aligin:center;' ";
  html += " ";
  html += "title='" + title + "'>";
  if(imgsrc != null){
    html += "<img src='"+imgsrc + "' " + "alt='" + title + "' style='width:80px;height:108px;' />";
  }
  html += "</div>";

  $(".products_box#products_box_1").append(html);
}
function nextPage(){
  if(page >= total_page)return jumpToPage( 1 );
  jumpToPage(++page);
}
function prePage(){
  if(page <= 1)return  jumpToPage( total_page );
  jumpToPage(--page);
}
function jumpToPage(page){
  this.page = page;
  // 本棚初期化
  $(".products_box#products_box_1").html("");
  for( i = BOOK_OF_PAGE * (page - 1) ; i < BOOK_OF_PAGE * page ; i ++){
    var item = cacheBooks[i];
    if(item!=null)
      appendInformation( item.barcode,item.amazon_id,item.title,item.author,item.amazon_image);
  }
  // ページナビナビゲーション初期化
  $("#pagepre").show();
  $("#pagenext").show()
  if(page <= 1){
    $("#pagepre").hide();
  }
  if(page >= total_page){
    $("#pagenext").hide();
  }
  refleshPageBar(page);
}
