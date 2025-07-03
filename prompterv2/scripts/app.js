$(document).ready(function() {
  var LYRICS = "";
  var LYRICS_ARRAY = [];
  var LYRICS_POS = 0;

  var setLanguage = function () {
    var lyrics = LYRICS.split('=');
    LYRICS_POS = 0;

    for (let i = 0; i < lyrics.length; i++) {
      lyrics[i] = lyrics[i].trim().split('\n');//.join("<br>");

      for (let j = 0; j < lyrics[i].length; j++) {
        if (lyrics[i][j].includes('[Title]')) {
          let lyric = lyrics[i][j].replace('[Title]','');
          lyrics[i][j] = `<span style="font-size: 80px;">${lyric.trim()}</span>`;
        }
        else if (lyrics[i][j].includes('[Subtitle]')) {
          let lyric = lyrics[i][j].replace('[Subtitle]','');
          lyrics[i][j] = `<span style="font-size: 36px; line-height: 24px!important;">${lyric.trim()}</span>`;
        }
        else {
          lyrics[i][j] = `<span style="font-size: 48px;">${lyrics[i][j]}</span>`;
        }
      }

      lyrics[i] = `<p>${lyrics[i].join('<br>')}</p>`;


      // console.log(lyrics[i]);
      // if (lyrics[i].startsWith('[Title]')) {
      //   let lyric = lyrics[i].replace('[Title]','');
      //   lyrics[i] = `<span style="font-size: 80px">${lyric.trim()}</span>`;
      // }
      // else if (lyrics[i].includes('[Subtitle]')) {
      //   lyrics[i] = lyrics[i].replace('[Subtitle]','<span style="font-size: 36px">');
      //   lyrics[i] = lyrics[i].replace('[/Subtitle]','</span>');
      // }
    }
    LYRICS_ARRAY = lyrics;
    console.log(LYRICS_ARRAY)
    $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);
  }

  var next = function () {
    
    $('#lyrics').fadeOut().promise().done(function() {
      if (LYRICS_POS < LYRICS_ARRAY.length)
        LYRICS_POS++;
      $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);

      $('#lyrics').fadeIn();
    });
  }

  var prev = function () {
    $('#lyrics').fadeOut().promise().done(function() {
      if (LYRICS_POS > 0)
        LYRICS_POS--;
      $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);

      $('#lyrics').fadeIn();
    });
  }

  $("#open_lyrics_file").on('change', function (event) {

    console.log(event.target.files);

    var reader = new FileReader();
    var extension = event.target.files[0].name.split('.').pop().toLowerCase();
    var docTypes = ["txt"];
    var isTxt = docTypes.indexOf(extension) > -1;

    $.ajax({
      url: './' +  $(this).prop('files')[0].name,
      type: 'GET',
      success: function(data){
        LYRICS = data;
        setLanguage();
      },
      error: function(data) {
        console.log(data);
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

