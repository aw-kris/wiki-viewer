$(document).ready(function() {
  var keyword, sroffset, articleEntry, totalHits;
  var wikiURL = "https://en.wikipedia.org/w/api.php";
  $('#homebtn').click(function() {
    $('#homebtn').addClass('hidden');
    $('#morebtn').addClass('hidden');
    $('#result').empty();
    $('#searchbox').val('');
    $('#header').removeClass('hidden');
  });

  function searchFunc() {
    $('#result').empty();
    $('#morebtn').addClass('hidden');
    $('#searchbox').blur();
    keyword = $('#searchbox').val();
    $.ajax({
      url: wikiURL,
      data: {
        action: 'query',
        format: 'json',
        list: 'search',
        srlimit: 5,
        srsearch: keyword
      },
      dataType: 'jsonp',
      success: function(data) {
        $('#header').addClass('hidden');
        $('#homebtn').removeClass('hidden');
        var resultArr = data.query.search;
        if (resultArr.length != 0) {
          sroffset = resultArr.length;
          totalHits = data.query.searchinfo.totalhits;
          resultArr.forEach(function(article) {
            var articleUrl = '<a href="http://en.wikipedia.org/wiki/' + article.title + '" target="_blank"><span id="link"></span></a>';
            articleEntry = '<div class="list"><h2>' + article.title + '</h2><p>' + article.snippet + articleUrl + '</p></div>';
            $('#result').append(articleEntry);
          });
          if (resultArr.length < totalHits) {
            $('#morebtn').removeClass('hidden');
          }
        } else {
          $('#result').append('<div class="text-center"><h4>No results found. Try another keyword.</h4></div>');
        }
      },
      error: function(e) {
        $('#result').append('<div class="text-center"><h4>Oh, no! Something went haywire, try again!</h4></div>');
      }
    });
  }

  $('#gobtn').on('click', searchFunc);

  $('#searchbox').keyup(function(e) {
    if (e.keyCode == 13) {
      searchFunc();
    }
  });

  $('#morebtn').on('click', function() {
    $.ajax({
      url: wikiURL,
      data: {
        action: 'query',
        format: 'json',
        list: 'search',
        srlimit: 5,
        sroffset: sroffset,
        srsearch: keyword
      },
      dataType: 'jsonp',
      success: function(data) {
        var resultArr = data.query.search;
        sroffset += resultArr.length;
        resultArr.forEach(function(article) {
          var articleUrl = '<a href="http://en.wikipedia.org/wiki/' + article.title + '" target="_blank"><span id="link"></span></a>';
          articleEntry = '<div class="list"><h2>' + article.title + '</h2><p>' + article.snippet + articleUrl + '</p></div>';
          $('#result').append(articleEntry);
        });
        if (resultArr.length < totalHits) {
          $('#morebtn').removeClass('hidden');
        } else {
          $('#morebtn').addClass('hidden');
        }
      }
    });
  })
});