$(document).ready(function() {
  //$('menu-container').css({top: "0px"});

  var LYRICS = "";
  var MARKUP = {
    "TAGL" : "TAGL=>",
    "ENGL" : "ENGL=>",
    "PORT" : "PORT=>",
    "SPAN" : "SPAN=>",
    "CEBU" : "CEBU=>",
    "KAPM" : "KAPM=>",
    "BICL" : "BICL=>",
    "COMM" : "COMM=>"
  }
  var REGEX = {
    "TAGL" : new RegExp('^' + MARKUP["TAGL"], 'g'),
    "ENGL" : new RegExp('^' + MARKUP["ENGL"], 'g'),
    "PORT" : new RegExp('^' + MARKUP["PORT"], 'g'),
    "SPAN" : new RegExp('^' + MARKUP["SPAN"], 'g'),
    "CEBU" : new RegExp('^' + MARKUP["CEBU"], 'g'),
    "KAPM" : new RegExp('^' + MARKUP["KAPM"], 'g'),
    "BICL" : new RegExp('^' + MARKUP["BICL"], 'g'),
    "COMM" : new RegExp('^' + MARKUP["COMM"], 'g')
  }
  var VISIBLE = {
    "TAGL" : true,
    "ENGL" : false,
    "PORT" : false,
    "SPAN" : false,
    "CEBU" : false,
    "KAPM" : false,
    "BICL" : false
  }

  var CURR_COLOR = "COLOR_GRAD";
  var FPS = 16.67;
  var SPEED = 1;

  // Event handler when selecting background color checkboxes
  $("input[type=radio].color-checkbox").on('click', function () {
    $("body").removeClass(CURR_COLOR);
    $("body").addClass(this.id);
    CURR_COLOR = this.id;
  });

  // Event handler when ticking the language
  $("input[type=checkbox].lang-checkbox").on('click', function () {
    VISIBLE[this.name] = !VISIBLE[this.name];
    setLanguage();
  });


  var setLanguage = function () {
    var SELECTED_LANG = 0;
    for (var key in VISIBLE) {
      if(VISIBLE[key]) SELECTED_LANG++; 
    }
    var lyrics_array_input = null;
    var lyrics_array_parsed = [];

    if (SELECTED_LANG <= 2) 
      lyrics_array_input = LYRICS.split("\/").join("<br>").split("\n");
    else 
      lyrics_array_input = LYRICS.split("\/").join("").split("\n");

    var SELECTED_LANG = 0;
    for (var key in VISIBLE) {
      if(VISIBLE[key] && LYRICS.match(new RegExp(MARKUP[key], 'g'))) 
        SELECTED_LANG++; 
    }
    for(var i = 0; i < lyrics_array_input.length; i++) {
      var formatted = '';
      if(VISIBLE["TAGL"] && lyrics_array_input[i].match(REGEX["TAGL"])) {
        formatted = "<a class='TEXT_TAGL'>" + lyrics_array_input[i].split(MARKUP["TAGL"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["ENGL"] && lyrics_array_input[i].match(REGEX["ENGL"])) {
        formatted = "<a class='TEXT_ENGL";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["ENGL"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["PORT"] && lyrics_array_input[i].match(REGEX["PORT"])) {
        formatted = "<a class='TEXT_PORT";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO"; 
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["PORT"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["SPAN"] && lyrics_array_input[i].match(REGEX["SPAN"])) {
        formatted = "<a class='TEXT_SPAN";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["SPAN"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["CEBU"] && lyrics_array_input[i].match(REGEX["CEBU"])) {
        formatted = "<a class='TEXT_CEBU";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["CEBU"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["KAPM"] && lyrics_array_input[i].match(REGEX["KAPM"])) {
        formatted = "<a class='TEXT_KAPM";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["KAPM"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["BICL"] && lyrics_array_input[i].match(REGEX["BICL"])) {
        var formatted = "<a class='TEXT_BICL";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["BICL"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(SELECTED_LANG > 0 && lyrics_array_input[i].match(REGEX["COMM"])) {
        formatted = "<a class='TEXT_COMM'>" + lyrics_array_input[i].split(MARKUP["COMM"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      
      if (lyrics_array_input[i] && lyrics_array_input[i].length < 2 ){
        if(SELECTED_LANG > 2) lyrics_array_parsed.push(' ');
        if(lyrics_array_input[i+1] && lyrics_array_input[i+1].length < 2) {
          if(SELECTED_LANG <= 2) lyrics_array_parsed.push(' ');
          else lyrics_array_parsed.pop();
        }
      }
    }

    for(var i = 0; i < lyrics_array_parsed.length; i++) {
      if(lyrics_array_parsed[i].match(/^.*\s?\.\s?\.\s?\.\s?.+/g)) {
        var matchval = lyrics_array_parsed[i].match(/\s?\.\s?\.\s?\.\s?/)[0];
        var newarr = lyrics_array_parsed[i].split(/\s?\.\s?\.\s?\.\s?/);
        lyrics_array_parsed[i] = newarr[0] + "<i style='font-size : 90%;'>" + matchval + newarr[1] + "</i>";
      }
      if(lyrics_array_parsed[i].match(/(HIMNO|HINO|HYMN|#)/g)) {
        lyrics_array_parsed[i] = "<i>" + lyrics_array_parsed[i] + "</i>";
      }
      if(lyrics_array_parsed[i].match(/\(/g)) {
        lyrics_array_parsed[i] = "<a style='font-size : 90%; font-weight: normal;'>" + lyrics_array_parsed[i];
      }
      if(lyrics_array_parsed[i].match(/\)/g)) {
        lyrics_array_parsed[i] = lyrics_array_parsed[i] + "</a>";
      }
    }
    document.getElementById('prompt-container').innerHTML = lyrics_array_parsed.join("<br>");
    $("html").scrollTop(0);   
  }

  var interval = null;
  var isClosed = false;
  var lastPressed = "";

  // Event handler when choosing file
  $("#lyrics-selector").on('change', function (event) {
    $.ajax({
      url: '/_txt/' +  $(this).prop('files')[0].name,
      type: 'GET',
      success: function(data){
        LYRICS = data;
        setLanguage();
      },
      error: function(data) {
        var reader = new FileReader();
        var extension = event.target.files[0].name.split('.').pop().toLowerCase();

        var imageTypes = ["jpg", "jpeg", "png"];
        var docTypes = ["txt"];

        var isImage = imageTypes.indexOf(extension) > -1;
        var isTxt = docTypes.indexOf(extension) > -1;
        
        if (isImage) {
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = function(){
            var elem = document.createElement("img");
            elem.src = reader.result;
            elem.setAttribute("id", "img-lyrics")
            elem.setAttribute("style", "position:absolute;left:0;width:100%;top:0")
            
            $('.lang-checkbox').attr('disabled', 'true');
            $('.color-checkbox').attr('disabled', 'true');

            $("#prompt-container").append(elem);
            $("html").scrollTop(0);

            isClosed = !isClosed;
            ($(document).find("#menu-container")).animate({ bottom: "-250px"}, 500);
          };
        }
        if (isTxt) {
          reader.readAsText(event.target.files[0]);
          reader.onload = function(){
          
            $('.lang-checkbox').removeAttr('disabled');
            $('.color-checkbox').removeAttr('disabled');

            LYRICS = reader.result;
            setLanguage();
            $("img-lyrics").remove();
            isClosed = !isClosed;
            ($(document).find("#menu-container")).animate({ bottom: "-250px"}, 500);
          };
        }
      }
    })        
  })

  var down = function (event) { 
    $("html").scrollTop($("html").scrollTop() + SPEED);
  }
  var up = function (event) { 
    $("html").scrollTop($("html").scrollTop() - SPEED);
  }

  $(document).on('keydown', function (event) {
    if (event.key === "ArrowLeft" && lastPressed === "ArrowRight") {
      clearInterval(interval);
      interval = null;
    }
    if (event.key === "ArrowRight" && lastPressed === "ArrowLeft"){
      clearInterval(interval);
      interval = null;
    } 

    if (event.key === "ArrowUp" && interval == null) {
      interval = setInterval(up, FPS);
      lastPressed = "ArrowUp";
    } 
    if (event.key === "ArrowDown" && interval == null) {
      interval = setInterval(down, FPS);
      lastPressed = "ArrowDown";
    }
    if (event.key === "ArrowLeft" && interval == null) {
      interval = setInterval(up, FPS);
      lastPressed = "ArrowLeft";
    }
    if (event.key === "ArrowRight" && interval == null) {
      interval = setInterval(down, FPS);
      lastPressed = "ArrowRight";
    }
  });

  $(document).on('keydown', function (event) {
    if (event.key === "1") {
      SPEED = 1;
    }
    if (event.key === "2") {
      SPEED = 3;
    }
    if (event.key === "3") {
      SPEED = 5;
    }
    if (event.key === "4") {
      SPEED = 10;
    }
    if (event.key === "5") {
      SPEED = 20
    }

    if (event.key === "+") {
      var size = parseInt($("#prompt-container").css('fontSize').split('px')[0]) + 5;
      $("#prompt-container").css({'fontSize': size});
    }
    if (event.key === "-") {
      var size = parseInt($("#prompt-container").css('fontSize').split('px')[0]) - 5;
      $("#prompt-container").css({'fontSize': size});
    }

    if (event.key === "Home") 
      $("html").scrollTop(0); 
    
    if (event.key == "Escape") {
      if (isClosed) {
        isClosed = !isClosed;
        $("#menu-container").animate({
          bottom: "0px",
        }, 500);
      }
      else{ 
        isClosed = !isClosed;
        $( "#menu-container" ).animate({
          bottom: "-250px",
        }, 500);           
      }
    }
  });

  $(document).on('keyup', function (event) {
    var events = ["ArrowDown", "ArrowUp"];
    if ((events.indexOf(event.key) !== -1) && interval != null) {
      clearInterval(interval);
      interval = null;
    } 
  });

});

