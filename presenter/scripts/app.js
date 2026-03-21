$(document).ready(function() {

  console.log(location.host)

  let socket;

  // 1. Check if we have a host
  if (location.host) {
    // 2. Determine protocol: use 'wss://' for HTTPS and 'ws://' for HTTP
    const protocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
    
    try {
      socket = new WebSocket(`${protocol}${location.host}`);

      socket.onopen = () => console.log("Connected to WebSocket");
      
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
      };

      socket.onmessage = (event) => {
        let message = JSON.parse(event.data);
        
        if (message.type == 'lyric') {
          LYRICS_MAIN = message.content.main;
          LYRICS_SUB = message.content.sub;
        } 
        else if (message.type == 'position') {
          lyricPosition = message.content;
        }
      };
    } 
    catch (e) {
      console.error("WebSocket construction failed:", e);
    }
  }

  // Initialize application.

  let FONTS = $('#text-font option').map(function () {
    return $(this).val();
  }).get();

  let fontPosition = 0;

  let LYRICS_MAIN = [];
  let LYRICS_SUB = [];
  let lyricPosition = 0;
  let lyricSpeed = 1000;

  let setLyrics = function (data) {
    
    lyricPosition = 0;

    LYRICS_MAIN = data.split('=')
      .map(section => {
        // 1. Split into lines and remove empty ones immediately
        const lines = section.trim().split('\n').filter(line => line.trim() !== "");

        // 2. Process each line individually
        const formattedLines = lines.map(line => {
          let text = line.replace(' | ', '<br>').trim();
          let className = "normal-text";

          // 3. Check for specific tags and set class accordingly
          if (text.includes('[Title]')) {
            text = text.replace('[Title]', '').trim();
            className = "title-text";
          } else if (text.includes('[Subtitle]')) {
            text = text.replace('[Subtitle]', '').trim();
            className = "subtitle-text";
          }

          return `<span class="${className}">${text}</span>`;
        });

        // 4. Join lines with <br> and wrap in a paragraph tag
        return `<p>${formattedLines.join('<br>')}</p>`;
      });
   
    LYRICS_SUB = data.split('=').map(section => {
      // Split into lines, trim them, and remove empty ones
      lines = section.trim().split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          let text = line.replace(' | ', ' ').trim();
          let className = "normal-text";

          // Determine the class based on the tag
          if (text.includes('[Title]')) {
            text = text.replace('[Title]', '').trim();
            className = "title-text";
          } 
          else if (text.includes('[Subtitle]')) {
            text = text.replace('[Subtitle]', '').trim();
            className = "subtitle-text";
          }

          return `<span class="${className}">${text}</span>`;
        });
        // Wrap the joined lines in a paragraph
        return `<p>${lines.join('<br>')}</p>`;
      });
   
    updateLyrics();

    sendMessage('lyric', {main : LYRICS_MAIN, sub : LYRICS_SUB});
  }

  let $mlyrics = $('#lyrics');
  let $slyrics = $('#lyrics-sub');
  let $menu = $('#settings');

  function sendMessage(type, content) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ 
        type : type, 'content' : content
      }));
    }
    else {
      console.warn('Message sending deferred since not connected to socket.');
    }
  }

  function updateLyricSpeed(seconds) {
      // 1. Update the CSS Variable on the root (HTML) element
      // This allows CSS like: animation-duration: var(--lyric-speed);
      $(':root').css('--lyric-speed', seconds + 's');

      // 2. Define a "Constant" in the global window object for JS timing
      // We convert it to milliseconds for setTimeout/delay use
      lyricSpeed = seconds * 1000;

      //console.log("Speed updated: " + seconds + "s / " + lyricSpeed + "ms");
  };

  // Function to change lyrics
  function updateLyrics() {

    // 1. Add the animation class
    $mlyrics.addClass("animate-lyric");
    $slyrics.removeClass("on").addClass("off");

    // 2. Use a Timer or AnimationEvent to swap text at the 50% mark (300ms)
    setTimeout(function() {
      $mlyrics.html(LYRICS_MAIN[lyricPosition]);
      $slyrics.html(LYRICS_SUB[lyricPosition]);
      sendMessage('position', lyricPosition);
    }, lyricSpeed/4); 

    // 3. Clean up the class when finished so it can be re-added later
    $mlyrics.one("animationend", function() {
      $mlyrics.removeClass("animate-lyric");
    });
    $slyrics.one("transitionend", function() {
      $slyrics.removeClass("off").addClass("on");
    });
  }


  $("#open_lyrics_file").on('change', function (event) {

    var reader = new FileReader();
    var extension = event.target.files[0].name.split('.').pop().toLowerCase();
    var docTypes = ["txt"];
    var isTxt = docTypes.indexOf(extension) > -1;

    $.ajax({
      url: './' +  $(this).prop('files')[0].name,
      type: 'GET',
      success: function(data){
        setLyrics(data);
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
            setLyrics(reader.result);
          };
        }
      }
    });
  });

  $(document).on('keydown', function (event) {

    if (event.key === "ArrowDown"){
      if (lyricPosition < LYRICS_MAIN.length) lyricPosition++;
      //sendMessage('position', lyricPosition)
      updateLyrics();
    }
    if (event.key === "ArrowUp"){
      if (lyricPosition > 0) lyricPosition--;
      //sendMessage('position', lyricPosition)
      updateLyrics();
    } 
    if (event.key == "Escape") {
      $menu.toggleClass('is-hidden-menu');

      console.log($menu.hasClass('is-hidden-menu'));
      
      if (!$menu.hasClass('is-hidden-menu')) {
        setTimeout(() => $('#open_lyrics_file').focus(), 50);
      }
      else {
        document.activeElement.blur();
        setTimeout(() => $("#prompt-container").focus(), 50);
      }
    }
    if(event.keyCode === 70) {
      $mlyrics.removeClass();
      
      fontPosition == FONTS.length ? fontPosition = 0 : fontPosition++;

      console.log(`Changing font to ${FONTS[fontPosition]}`);
      $mlyrics.addClass(FONTS[fontPosition]);
    }

    if (event.keyCode == 187) {
      zoom = zoom + .25;
      $mlyrics.css('zoom', zoom);
    }
    if (event.keyCode == 189) {
      zoom = zoom - .25;
      $mlyrics.css('zoom', zoom);
    }

    if (event.key == " "){
      $mlyrics.toggleClass("off");
      $slyrics.toggleClass("off");
    }
  });

  let font = 'arial';
  let zoom = 1;

  $('#bg-color').on('change', function () {
    $('#wrapper').css('background', $(this).val());
    console.log('Meow')
  });
  $('#text-color').on('change', function () {
    $mlyrics.css('color', $(this).val());
  });
  $('#text-font').on('change', function () {
    $mlyrics.removeClass(font);
    font = $(this).val();
    $mlyrics.addClass(font);
  });
  $('#zoom-up').on('click', function () {
    zoom = zoom + .25;
    $mlyrics.css('zoom', zoom);
    //$('#lyrics-sub').css('zoom', zoom);
  });
  $('#zoom-down').on('click', function () {
    zoom = zoom - .25;
    $mlyrics.css('zoom', zoom);
    //$('#lyrics-sub').css('zoom', zoom);
  });
});

