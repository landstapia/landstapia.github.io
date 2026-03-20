$(document).ready(function() {
  //$('menu-container').css({top: "0px"});

  var FPS = 16.67;
  var SPEED = 1;

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

