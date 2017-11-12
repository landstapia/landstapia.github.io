$(document).ready(function() {
  var LYRICS = "";
  var LYRICS_ARRAY = [];
  var LYRICS_POS = 0;

  var setLanguage = function () {
    var lyrics = LYRICS.split('=');
    LYRICS_POS = 0;

    for (var i = 0; i < lyrics.length; i++) {
      lyrics[i] = lyrics[i].trim().split('\n').join("<br>");
    }
    LYRICS_ARRAY = lyrics;
    $('#lyrics').hide().html(LYRICS_ARRAY[LYRICS_POS]).fadeIn('slow');
  }

  var next = function () {
    if (LYRICS_POS < LYRICS_ARRAY.length)
      LYRICS_POS++;
    $('#lyrics').hide().html(LYRICS_ARRAY[LYRICS_POS]).fadeIn(1000);
  }
  var prev = function () {
    if (LYRICS_POS > 0)
      LYRICS_POS--;
    $('#lyrics').hide().html(LYRICS_ARRAY[LYRICS_POS]).fadeIn('slow');
  }

  $("#open_lyrics_file").on('change', function () {
    $.ajax({
      url: '/prompterv2/' +  $(this).prop('files')[0].name,
      type: 'GET',
      success: function(data){
        LYRICS = data;
        setLanguage();
      },
      error: function(data) {
        var reader = new FileReader();
        var extension = event.target.files[0].name.split('.').pop().toLowerCase();
        var docTypes = ["txt"];
        var isTxt = docTypes.indexOf(extension) > -1;

        if (isTxt) {
          reader.readAsText(event.target.files[0]);
          reader.onload = function(){
            LYRICS = reader.result;
            setLanguage();
          };
        }
      }
    });
  });

  var interval = null;
  var isClosed = false;
  $(document).on('keydown', function (event) {
    if (event.key === "ArrowDown" && interval == null)
      next();
    if (event.key === "ArrowUp" && interval == null) 
      prev();
    if (event.key == "Escape")
      $("#open_lyrics_file").click();
    if (event.key == " ")
      $("#lyrics").toggle('slow');
  });

  $(document).on('keyup', function (event) {
    var events = ["ArrowDown", "ArrowUp"];
    if ((events.indexOf(event.key) !== -1) && interval != null) {
      clearInterval(interval);
      interval = null;
    } 
  });

});

