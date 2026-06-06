$(document).ready(function() {
  console.log(location.host)

  let socket;

  // 1. Check if we have a host
  if (location.host) {
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
  let $mlyrics = $('#lyrics');
  let $slyrics = $('#lyrics-sub');
  let $menu = $('#settings');
  let $fontSelect = $('#text-font');
  let $transitionSelect = $('#transition-type');
  let $speedInput = $('#speed-ms'); // Cache speed input

  let FONTS = $fontSelect.find('option').map(function () {
    return $(this).val();
  }).get();

  let fontPosition = 0;
  let font = 'arial'; // Current font tracker
  let zoom = 1;
  let currentTransition = 'lyricSwap'; // Default transition

  let LYRICS_MAIN = [];
  let LYRICS_SUB = [];
  let lyricPosition = 0;
  
  // Initialize speed from the HTML input value
  let lyricSpeed = parseInt($speedInput.val()) || 800;
  document.documentElement.style.setProperty('--lyric-speed', lyricSpeed + 'ms');

  let setLyrics = function (data) {
    lyricPosition = 0;
    LYRICS_MAIN = data.split('=').map(section => {
      const lines = section.trim().split('\n').filter(line => line.trim() !== "");
      const formattedLines = lines.map(line => {
        let text = line.replace(' | ', '<br>').trim();
        let className = "normal-text";
        if (text.includes('[Title]')) {
          text = text.replace('[Title]', '').trim();
          className = "title-text";
        } else if (text.includes('[Subtitle]')) {
          text = text.replace('[Subtitle]', '').trim();
          className = "subtitle-text";
        }
        return `<span class="${className}">${text}</span>`;
      });
      return `<p>${formattedLines.join('<br>')}</p>`;
    });

    LYRICS_SUB = data.split('=').map(section => {
      let lines = section.trim().split('\n')
        .filter(line => line.trim() !== '')
        .map(line => {
          let text = line.replace(' | ', ' ').trim();
          let className = "normal-text";
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
      return `<p>${lines.join('<br>')}</p>`;
    });

    updateLyrics();
    sendMessage('lyric', {main : LYRICS_MAIN, sub : LYRICS_SUB});
  }

  function sendMessage(type, content) {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type : type, 'content' : content }));
    }
  }

  function updateLyrics() {
    // Get latest speed from input
    lyricSpeed = parseInt($speedInput.val()) || 0;

    // Apply the selected transition animation name
    $mlyrics.css('animation-name', currentTransition);
    $mlyrics.addClass("animate-lyric");

    $slyrics.removeClass("on").addClass("off");

    // SWAP AT 50%: Improved timing logic based on user speed input
    setTimeout(function() {
      $mlyrics.html(LYRICS_MAIN[lyricPosition]);
      $slyrics.html(LYRICS_SUB[lyricPosition]);
      sendMessage('position', lyricPosition);
    }, lyricSpeed / 2); 

    $mlyrics.one("animationend", function() {
      $mlyrics.removeClass("animate-lyric");
      $mlyrics.css('animation-name', ''); // Reset after animation
    });
    $slyrics.one("transitionend", function() {
      $slyrics.removeClass("off").addClass("on");
    });
  }

  $("#open_lyrics_file").on('change', function (event) {
    $.ajax({
      url: './' +  $(this).prop('files')[0].name,
      type: 'GET',
      success: function(data){ setLyrics(data); },
      error: function(data) {
        var reader = new FileReader();
        reader.readAsText(event.target.files[0]);
        reader.onload = function(){ setLyrics(reader.result); };
      }
    });
  });

  $(document).on('keydown', function (event) {
    if (event.key === "ArrowDown"){
      if (lyricPosition < LYRICS_MAIN.length - 1) lyricPosition++;
      updateLyrics();
    }
    if (event.key === "ArrowUp"){
      if (lyricPosition > 0) lyricPosition--;
      updateLyrics();
    } 
    if (event.key == "Escape") {
      $menu.toggleClass('is-hidden-menu');
    }

    // Font Cycle Key (F)
    if(event.keyCode === 70) {
      $mlyrics.removeClass(font);
      $fontSelect.removeClass(font);

      fontPosition = (fontPosition + 1) % FONTS.length;
      font = FONTS[fontPosition];

      $mlyrics.addClass(font);
      $fontSelect.val(font).addClass(font); 
      console.log(`Cycling font to: ${font}`);
    }

    // Transition Cycle Key (T)
    if(event.keyCode === 84) { 
      let transitions = $transitionSelect.find('option').map(function() {
        return $(this).val();
      }).get();

      let currentIndex = transitions.indexOf(currentTransition);
      let nextIndex = (currentIndex + 1) % transitions.length;

      currentTransition = transitions[nextIndex];
      $transitionSelect.val(currentTransition);
      console.log(`Cycling transition to: ${currentTransition}`);
    }

    if (event.keyCode == 187) { zoom += .25; $mlyrics.css('zoom', zoom); }
    if (event.keyCode == 189) { zoom -= .25; $mlyrics.css('zoom', zoom); }

    if (event.key == " "){
      $mlyrics.toggleClass("off");
      $slyrics.toggleClass("off");
    }
  });

  $('#bg-color').on('change', function () {
    $('#wrapper').css('background', $(this).val());
  });

  $('#text-color').on('change', function () {
    $mlyrics.css('color', $(this).val());
  });

  // Main Dropdown Font Logic
  $fontSelect.on('change', function () {
    $mlyrics.removeClass(font);
    $(this).removeClass(font); 

    font = $(this).val(); 
    fontPosition = FONTS.indexOf(font); 

    $mlyrics.addClass(font);
    $(this).addClass(font); 
  });

  // Transition Dropdown Logic
  $transitionSelect.on('change', function() {
    currentTransition = $(this).val();
  });

  // Speed Input Logic: Update CSS variable in real-time
  $speedInput.on('input', function() {
    let ms = $(this).val();
    if (ms === "") ms = 0;
    document.documentElement.style.setProperty('--lyric-speed', ms + 'ms');
  });

  $('#zoom-up').on('click', function () { zoom += .25; $mlyrics.css('zoom', zoom); });
  $('#zoom-down').on('click', function () { zoom -= .25; $mlyrics.css('zoom', zoom); });
});