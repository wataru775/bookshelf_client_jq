
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
    var date = new Date();
    var html = "";
    var trid = (item != undefined)?"true":"fail";
    html += "<tr id='" + trid + "'>";

    html += "<td>";
    if(item != undefined){
      html += "<form method='post' action='http://www.mmpp.org/service/bookdb/commit_book.json'>";
      html += "<input type='hidden' name='title' value='" + item.title + "'>";
      html += "<input type='hidden' name='author' value='" + createAuthorData(item.authors) + "'>";
      html += "<input type='hidden' name='barcode' value='" + item.isbn + "'>";
      html += "<input type='hidden' name='publisher' value='" + item.publisher + "'>";
      html += "<input type='hidden' name='magazine' value='" + item.publisher + "'>";
      html += "<input type='hidden' name='m_code' value=''>";
      html += "<input type='hidden' name='release_date' value='" + item.pubdate + "'>";
      html += "<input type='hidden' name='amazon_image' value='" + item.image_url + "'>";
      html += "<input type='hidden' name='amazon_id' value='" + item.asin + "'>";
      html += "</form>";

     }

      if(item != undefined){
        html +=  "<img src=";
        html += "'" + item.image_url + "'";
        html += " />";
      }
    html += "</td>";
    html += "<td >";
      html += date.toLocaleDateString() + " " + date.toLocaleTimeString();
    html += "</td>";
    if(item != undefined){
      html += "<td>";
        html += item.isbn;
      html += "</td>";
      html += "<td>";
        html += item.asin;
      html += "</td>";
      html += "<td>";
        html += item.title;
      html += "</td>";
      html += "<td>";
        html += item.author;
      html += "</td>";
    }else{
      html += "<td>";
      html += code;
      html += "</td>";
      html += "<td>";
      html += "</td>";
      html += "<td>";
      html += "</td>";
      html += "<td>";
      html += "</td>";

    }
    html += "</tr>";

    $("#myTable tbody").append(html);
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
