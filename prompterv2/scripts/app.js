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
          lyrics[i][j] = `<span class="title-text">${lyric.trim()}</span>`;
        }
        else if (lyrics[i][j].includes('[Subtitle]')) {
          let lyric = lyrics[i][j].replace('[Subtitle]','');
          lyrics[i][j] = `<span class="subtitle-text">${lyric.trim()}</span>`;
        }
        else {
          lyrics[i][j] = `<span class="normal-text">${lyrics[i][j]}</span>`;
        }
      }

      lyrics[i] = `<p>${lyrics[i].join('<br>')}</p>`;

      // console.log(lyrics[i]);
      // if (lyrics[i].startsWith('[Title]')) {
      //   let lyric = lyrics[i].replace('[Title]','');
      //   lyrics[i] = `<span style="font-size: 80px">${lyric.trim()}</span>`;
      // else if (lyrics[i].includes('[Subtitle]')) {
      //   lyrics[i] = lyrics[i].replace('[Subtitle]','<span style="font-size: 36px">');
      //   lyrics[i] = lyrics[i].replace('[/Subtitle]','</span>');
      // }
      // }
    }

    LYRICS_ARRAY = lyrics;
    console.log(LYRICS_ARRAY)
    $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);
  }


  function zoomIn($el) {
    $el.removeClass("off").addClass("on");
  }

  function zoomOut($el) {
    $el.removeClass("on");  // step 1: remove zoom-in
    void $el[0].offsetWidth; // step 2: force reflow
    $el.addClass("off");     // step 3: add zoom-out
  }

  var next = function () {
    
    // $('#lyrics').fadeOut().promise().done(function() {
    //   if (LYRICS_POS < LYRICS_ARRAY.length)
    //     LYRICS_POS++;
    //   $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);

    //   $('#lyrics').fadeIn();
    // });

    let $el = $('#lyrics');

    // Step 1: fade out while staying zoomed in
    $el.removeClass("on").addClass("fade");

    // Step 2: after fade finishes
    $el.one("transitionend", function(e) {
      if (e.originalEvent.propertyName === "opacity") {

        // Snap scale back to normal while invisible
        $el.removeClass("fade").addClass("off");

        // Change the position of the lyrics
        if (LYRICS_POS < LYRICS_ARRAY.length) LYRICS_POS++;
        $el.html(LYRICS_ARRAY[LYRICS_POS]);

        // Force reflow so browser registers the scale reset
        void $el[0].offsetWidth;

        // Step 3: fade in again
        $el.removeClass("off").addClass("on");
      }
    });
    
  }

  var prev = function () {
    // $('#lyrics').fadeOut().promise().done(function() {
    //   if (LYRICS_POS > 0)
    //     LYRICS_POS--;
    //   $('#lyrics').html(LYRICS_ARRAY[LYRICS_POS]);

    //   $('#lyrics').fadeIn();
    // });

    let $el = $('#lyrics');

    // Step 1: fade out while staying zoomed in
    $el.removeClass("on").addClass("fade");

    // Step 2: after fade finishes
    $el.one("transitionend", function(e) {
      if (e.originalEvent.propertyName === "opacity") {

        // Snap scale back to normal while invisible
        $el.removeClass("fade").addClass("off");

        // Change the position of the lyrics
        if (LYRICS_POS < LYRICS_ARRAY.length) LYRICS_POS--;
        $el.html(LYRICS_ARRAY[LYRICS_POS]);

        // Force reflow so browser registers the scale reset
        void $el[0].offsetWidth;

        // Step 3: fade in again
        $el.removeClass("off").addClass("on");
      }
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
      $("#settings").fadeToggle();
    if (event.key == " "){
      console.log('meow');
      $("#lyrics").fadeToggle('slow');
    }
  });

  $(document).on('keyup', function (event) {
    var events = ["ArrowDown", "ArrowUp"];
    if ((events.indexOf(event.key) !== -1) && interval != null) {
      clearInterval(interval);
      interval = null;
    } 
  });

  let font = 'arial';

  $('#select-bg-color').on('change', function () {
    $('#wrapper').css('background', $(this).val());
  });
  $('#text-color').on('change', function () {
    $('#lyrics').css('color', $(this).val());
  });
  $('#text-font').on('change', function () {
    $('#lyrics').removeClass(font);
    font = $(this).val();
    $('#lyrics').addClass(font);
  });
});

