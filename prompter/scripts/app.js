$(document).ready(function() {
  //$('menu-container').css({top: "0px"});

  var LYRICS = "";
  var MARKUP = {
    "FIL" : "FIL=>",
    "ENG" : "ENG=>",
    "POR" : "POR=>",
    "SPA" : "SPA=>",
    "CEB" : "CEB=>",
    "PAM" : "PAM=>",
    "BIC" : "BIC=>",
    "SUB" : "SUB=>",
    "COM" : "COM=>"
  }
  var REGEX = {
    "FIL" : new RegExp('^' + MARKUP["FIL"], 'g'),
    "ENG" : new RegExp('^' + MARKUP["ENG"], 'g'),
    "POR" : new RegExp('^' + MARKUP["POR"], 'g'),
    "SPA" : new RegExp('^' + MARKUP["SPA"], 'g'),
    "CEB" : new RegExp('^' + MARKUP["CEB"], 'g'),
    "PAM" : new RegExp('^' + MARKUP["PAM"], 'g'),
    "BIC" : new RegExp('^' + MARKUP["BIC"], 'g'),
    "SUB" : new RegExp('^' + MARKUP["SUB"], 'g'),
    "COM" : new RegExp('^' + MARKUP["COM"], 'g')
  }
  var VISIBLE = {
    "FIL" : true,
    "ENG" : false,
    "POR" : false,
    "SPA" : false,
    "CEB" : false,
    "PAM" : false,
    "BIC" : false
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

    // Event handler when ticking the language
  $("input[type=checkbox].mark-checkbox").on('click', function () {
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
      if(VISIBLE["FIL"] && lyrics_array_input[i].match(REGEX["FIL"])) {
        formatted = "<span class='TEXT_FIL'>" + lyrics_array_input[i].split(MARKUP["FIL"])[1] + "</span>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["ENG"] && lyrics_array_input[i].match(REGEX["ENG"])) {
        formatted = "<span class='TEXT_ENG";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["ENG"])[1] + "</span>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["POR"] && lyrics_array_input[i].match(REGEX["POR"])) {
        formatted = "<span class='TEXT_POR";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO"; 
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["POR"])[1] + "</span>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["SPA"] && lyrics_array_input[i].match(REGEX["SPA"])) {
        formatted = "<a class='TEXT_SPA";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["SPA"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["CEB"] && lyrics_array_input[i].match(REGEX["CEB"])) {
        formatted = "<a class='TEXT_CEB";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["CEB"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["PAM"] && lyrics_array_input[i].match(REGEX["PAM"])) {
        formatted = "<a class='TEXT_PAM";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["PAM"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(VISIBLE["BIC"] && lyrics_array_input[i].match(REGEX["BIC"])) {
        var formatted = "<a class='TEXT_BIC";
        if(SELECTED_LANG === 1) 
          formatted += " TEXT_SOLO";
        formatted += "'>" + lyrics_array_input[i].split(MARKUP["BIC"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(SELECTED_LANG > 0 && lyrics_array_input[i].match(REGEX["SUB"])) {
        formatted = "<a class='TEXT_SUB'>" + lyrics_array_input[i].split(MARKUP["SUB"])[1] + "</a>";
        lyrics_array_parsed.push(formatted);
      }
      if(SELECTED_LANG > 0 && lyrics_array_input[i].match(REGEX["COM"])) {
        formatted = "<a class='TEXT_COM'>" + lyrics_array_input[i].split(MARKUP["COM"])[1] + "</a>";
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
    if ((event.key === "ArrowLeft" || event.key === "9") && lastPressed === "ArrowRight") {
      clearInterval(interval);
      interval = null;
    }
    if ((event.key === "ArrowRight" || event.key === "0") && lastPressed === "ArrowLeft"){
      clearInterval(interval);
      interval = null;
    } 

    if ((event.key === "ArrowUp" || event.key === "7") && interval == null) {
      interval = setInterval(up, FPS);
      lastPressed = "ArrowUp";
    } 
    if ((event.key === "ArrowDown" || event.key === "8") && interval == null) {
      interval = setInterval(down, FPS);
      lastPressed = "ArrowDown";
    }
    if ((event.key === "ArrowLeft" || event.key === "9") && interval == null) {
      interval = setInterval(up, FPS);
      lastPressed = "ArrowLeft";
    }
    if ((event.key === "ArrowRight" || event.key === "0")  && interval == null) {
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
    var events = ["ArrowDown", "ArrowUp", "7", "8"];
    if ((events.indexOf(event.key) !== -1) && interval != null) {
      clearInterval(interval);
      interval = null;
    } 
  });

});

