  startingIdx = 0;
  startingDegree = 0;
  numCharacterSpaces = 27;
  arcDegrees = 360;
  letterSpacingDelta = (arcDegrees / numCharacterSpaces);
  positionArray = [];
  isMoving = false;
  charSelector = 1;

  var setPositions = function() {
    for (i = 0; i < numCharacterSpaces; i++) {
      positionArray.push(startingDegree);
      startingDegree += letterSpacingDelta;
    }
  }

  var setRotationSpeed = function(gammaDeg) {
    if (gammaDeg === 10) {
      setTimeout(function() {
        isMoving = false;
      }, 300);
    }
    if (gammaDeg === 20) {
      setTimeout(function() {
        isMoving = false;
      }, 100);
    }
  }

  var getRotationDegrees = function(element) {
    var matrix = $(element).css("transform");
    // debugger
    if (matrix !== 'none') {
      // debugger
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
      var angle = 0;
    }

    if (angle < 0) angle += 360;
    return angle;
  };

  var smoothRotation = function(element, idx) {
    var origRotationDegree = getRotationDegrees(element);
    var rotationDegrees = positionArray[idx];
    
    // debugger
    if (origRotationDegree > rotationDegrees) {
      var step = (origRotationDegree - rotationDegrees) / 3;
      // debugger
      for (var i = origRotationDegree; i > rotationDegrees; ) {
        // setTimeout(function () {
        var rotationString = "rotate(" + i + "deg)";
        $(element).css("transform", rotationString);
        // debugger
        // i - step;
        // }, 100);
      }
    }
  }
  // var smoothRotation = function(element, origRotationDegree, rotationDegrees) {
  //   var step = (rotationDegrees - origRotationDegree)/5;
  //   // debugger
  //   for (var i = origRotationDegree; i < rotationDegrees; i++) {
  //     setTimeout(function () {
  //       var rotationString = "rotate(" + i + "deg)";
  //       $(element).css("transform", rotationString);
  //       debugger
  //       i + step;
  //     }, 100);
  //   }
  // }

  var arrangeChars = function(element, idx, gammaDeg) {
    var origRotationDegree = getRotationDegrees(element);
    var rotationDegrees = positionArray[idx];

    // if (origRotationDegree != rotationDegrees) {
    //   // debugger
    //   smoothRotation(element, origRotationDegree, rotationDegrees);
    // }

    var rotationString = "rotate(" + rotationDegrees + "deg)";
    $(element).css("transform", rotationString);

    if (rotationDegrees === 0) {
      $(element).addClass("active-letter");
    } else {
      $(element).removeClass("active-letter");
    }

    setRotationSpeed(gammaDeg);
  }

  var moveRight = function(gammaDeg) {
    if (!isMoving) {
      // debugger
      isMoving = true;
      positionArray.unshift(positionArray.pop());
      $('span').each(function(idx) {
        // arrangeChars(this, idx, gammaDeg);
        smoothRotation(this, idx);
      });
    }
  }

  var moveLeft = function(gammaDeg) {
    if (!isMoving) {
      isMoving = true;
      positionArray.push(positionArray.shift())
      $('span').each(function(idx) {
        arrangeChars(this, idx, gammaDeg);
      });
    }
  }

  // var stopMotion = function(gammaDeg) {
  //   isMoving = false;
  //   $('span').each(function(idx) {
  //     arrangeChars(this, idx, gammaDeg);
  //   });
  // }

  $(window).ready(function() {
    setPositions();

    $('span').each(function(idx) {
      arrangeChars(this, idx);
    });

    window.addEventListener("deviceorientation", handleOrientation, true);

    function handleOrientation(event) {
      // event.absolute true false
      // event .alpha z-axis 0 to 360
      // event.beta x-axis -180 t0 180, front/back
      // event.gamma y-axis -90 t0 90, left/right

      if (event.gamma > 20) {
        moveRight(20);
      }
      if (event.gamma < -20) {
        moveLeft(20);
      }
      if (event.gamma > 10) {
        moveRight(10);
      }
      if (event.gamma < -10) {
        moveLeft(10);
      }

      // if (event.gamma < 10 && event.gamma > -10) {
      //   // debugger
      //   stopMotion(0);
      // }
    };

    $("button").on("click", function() {
      var currentLetter = $(".active-letter").text();

      if (isMoving === false) {
        if (currentLetter !== "<") {
          $(".char" + charSelector).text(currentLetter);
          if (charSelector < 9) {
            charSelector += 1;
          }
        } else {
          $(".char" + (charSelector - 1)).text("_");
          if (charSelector > 1) {
            charSelector -= 1;
          }
        }
      }
    });
  });