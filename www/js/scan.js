  var cacheBookCodes = new Array();
  $(document).ready(function() {
      $("#inputTable input[name=isbn]").on('keydown',function(key){
        if(key.keyCode != 13) return;
        $("#inputTable #scan").click();
      });
      $("#inputTable #scan").on('click',function(){
        onScan();
      });
      $("#inputTable input[name=isbn]").on('chenge',function(){
        if($("#inputTable input[name=isbn]").val().length != 13 ) return false;
        onScan();
      });

      $('#commit').on("click",function(){
        document.forms[0].submit();
      });
  });

  function onScan(){
    code = $("#inputTable input[name=isbn]").val();
    code = code.replace(/[！-～]/g,
      function( tmpStr ) {
        // 文字コードをシフト
        return String.fromCharCode( tmpStr.charCodeAt(0) - 0xFEE0 );
      }
    );

    // 入力リセット
    $("#inputTable input[name=isbn]").val("");

    // 例外処理
    if(code.length == 0)return false;

    console.log("input : " + code);
    // 長さチェック
    // 10か13以外はエラー
    if(code.length != 10 && code.length != 13){
      appendBookFail(code);
      return false;
    }
    // チェックサム
    if(!isChecksum(code)){
      // コード例外処理
      appendBookFail(code);
      return false;
    }
    // 再スキャンは処理をやめる
    if(cacheBookCodes.includes(code))return;

    // スキャン済に追加する
    cacheBookCodes.push(code);
    $.getJSON('http://www.mmpp.org/service/aws_ecs/item_lookup.json?',
      {
        isbn: code
      }
    )
    .done(function(data) {

      if(data.IsValid != "TRUE"){
        appendBookFail(code);
        return ;
      }

      // スキャン結果をテーブルに追加
      appendBookInformation(code,data.RESULT);
    });
  }
  function isChecksum(code){
    return true;
  }
  function appendBookFail(isbn){
    appendInformation(isbn);
  }
  function appendBookInformation(isbn,item){
    appendInformation(isbn,item);
  }
  function appendInformation(isbn,item){
    console.log(item);
    var html = "";

    if(item != undefined){
      html += createLineHtml(item);
    }else{
      html += createLineHtmlFail(code);
    }

    $("#myTable>tbody").append(html);
  }
  function createAuthorData(authors) {
      var author = "";
      for (i = 0; i < authors.length; i++) {
          if (authors[i].role == '')
              role = "著";
          else
              role = authors[i].role;
          author = author + authors[i].author + "(" + role + ")";

          if (i != authors.length - 1)
              author = author + ",";
      }

      return author;
  }
  function createLineHtml(item){
    var date = new Date();
    var html = "";
    html += "<tr >";
    html += "<td>";
    html += "<input type='hidden' name='amazon_image' value='" + item.image_url + "'>";

    html +=  "<img src=";
    html += "'" + item.image_url + "'";
    html += " />";

    html += "</td>";
    html += "<td >";

      html += date.toLocaleDateString() + " " + date.toLocaleTimeString();
    html += "</td>";
    html += "<td>";
      html += item.isbn;
      html += "<input type='hidden' name='barcode' value='" + item.isbn + "'>";
      html += "</td>";
      html += "<td>";
    html += "<form method='post' action='http://www.mmpp.org/service/bookdb/commit_book.json'>";

    html += "<table style='width:100%' id='bookform'>";

      html += "<tr>";
      html += "<th style='width:15%;'> asin </th>";
      html += "<td>";
        html += item.asin;
        html += "<input type='hidden' name='amazon_id' value='" + item.asin + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> タイトル </th>";
      html += "<td>";
        html += "<input type='text' name='title' style='width:90%;' value='" + item.title + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> 著者 </th>";
      html += "<td>";
      html += "<input type='text' name='author' style='width:90%;' value='" + createAuthorData(item.authors) + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> 発売日 </th>";
      html += "<td>";
      html += "<input type='text' name='release_date' value='" + item.pubdate + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> 出版社 </th>";
      html += "<td>";
      html += "<input type='text' name='publisher' style='width:90%;' value='" + item.publisher + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> 掲載雑誌 </th>";
      html += "<td>";
      html += "<input type='text' name='magazine' style='width:90%;' value='" + item.publisher + "'>";
      html += "</td>";
      html += "</tr>";

      html += "<tr>";
      html += "<th> コード </th>";
      html += "<td>";
      html += "<input type='text' name='m_code' value=''>";
      html += "</td>";
      html += "</tr>";

      html += "</table>";
      html += "</form>";
    html += "</td>";
    html += "</tr>";

    return html;
  }
  function createLineHtmlFail(code){
    var date = new Date();
    var html = "";
    html += "<tr id='fail'>";
    html += "<td>";

    html += "</td>";
    html += "<td >";
      html += date.toLocaleDateString() + " " + date.toLocaleTimeString();
    html += "</td>";

    html += "<td>";
    html += code;
    html += "</td>";
    html += "<td>" + "</td>";
    html += "</tr>";

    return html;
  }
