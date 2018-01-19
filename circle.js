  arcDegrees = 360;
  numCharacterSpaces = 27;
  startingDegree = 0;
  letterSpacingDelta = (arcDegrees / numCharacterSpaces);
  positionArray = [];
  charSelector = 1;
  yAxisSpin = 10;
  yAxisSpeedUp = 20;
  yAxisFastest = 30;
  XAxisAllowsMovement = 60;
  movementDelta = letterSpacingDelta / 500;
  spinSpeed = 0;
  speedUpSpeed = 0.1;
  fastestSpeed = 0.2;


  var setPositions = function() {
    for (i = 0; i < numCharacterSpaces; i++) {
      positionArray.push(startingDegree);
      startingDegree += letterSpacingDelta;
    }
  }

  var arrangeChars = function(element, idx) {
    var rotationDegrees = positionArray[idx];

    if ($(element).hasClass("active-letter")) {
      var rotationString = "rotate(" + 0 + "deg)";
      $(element).css("transform", rotationString);
    } else {
      var rotationString = "rotate(" + rotationDegrees + "deg)";
      $(element).css("transform", rotationString);
      var letterRotationString = "rotate(" + -rotationDegrees + "deg)";
      $(element).find(".letter").css("transform", letterRotationString)
    }

    if ((rotationDegrees > (arcDegrees - letterSpacingDelta / 2)) || (rotationDegrees < letterSpacingDelta / 2)) {
      $(element).addClass("active-letter");
    } else {
      $(element).removeClass("active-letter");
    }
  }

  var setLeftPositions = function(yAxisTilt) {
    var leftDelta;

    if (yAxisTilt === "yAxisSpin") {
      leftDelta = movementDelta + spinSpeed;
    }
    if (yAxisTilt === "yAxisSpeedUp") {
      leftDelta = movementDelta + speedUpSpeed;
    }
    if (yAxisTilt === "yAxisFastest") {
      leftDelta = movementDelta + fastestSpeed;
    }

    var newpositions = positionArray.map(function(num) {
      var newDegree;

      if ((num + leftDelta) > arcDegrees) {
        newDegree = 0;
      } else {
        newDegree = num + leftDelta;
      }

      return newDegree;
    });
    positionArray = newpositions;
  }

  var setRightPositions = function(yAxisTilt) {
    var rightDelta;

    if (yAxisTilt === "yAxisSpin") {
      rightDelta = movementDelta + spinSpeed;
    }
    if (yAxisTilt === "yAxisSpeedUp") {
      rightDelta = movementDelta + speedUpSpeed;
    }
    if (yAxisTilt === "yAxisFastest") {
      rightDelta = movementDelta + fastestSpeed;
    }

    var newpositions = positionArray.map(function(num) {
      var newDegree;

      if ((num - rightDelta) < 0) {
        newDegree = arcDegrees;
      } else {
        newDegree = num - rightDelta;
      }

      return newDegree;
    });
    positionArray = newpositions;
  }

  var moveLeft = function(yAxisTilt) {
    var start = Date.now();

    var timer = setInterval(function() {
      var timePassed = Date.now() - start;

      if (timePassed >= 200) {
        clearInterval(timer);
        return
      }

      setLeftPositions(yAxisTilt);
      $('.input').each(function(idx) {
        arrangeChars(this, idx, yAxisTilt);
      });
    });
  }

  var moveRight = function(yAxisTilt) {
    var start = Date.now();

    var timer = setInterval(function() {
      var timePassed = Date.now() - start;

      if (timePassed >= 200) {
        clearInterval(timer);
        return
      }

      setRightPositions(yAxisTilt);
      $('.input').each(function(idx) {
        arrangeChars(this, idx, yAxisTilt);
      });
    });
  }

  $(window).ready(function() {
    setPositions();

    $('.input').each(function(idx) {
      arrangeChars(this, idx);
    });

    window.addEventListener("deviceorientation", handleOrientation, true);

    function handleOrientation(event) {
      // event.absolute true false
      // event .alpha z-axis 0 to 360
      // event.beta x-axis -180 t0 180, front/back
      // event.gamma y-axis -90 t0 90, left/right

      if ((event.beta < XAxisAllowsMovement && event.beta >= 0) || (event.beta > -XAxisAllowsMovement && event.beta <= 0)) {
        if (event.gamma > yAxisSpin) {
          moveRight("yAxisSpin");
        }
        if (event.gamma < -yAxisSpin) {
          moveLeft("yAxisSpin");
        }

        if (event.gamma > yAxisSpeedUp) {
          moveRight("yAxisSpeedUp");
        }
        if (event.gamma < -yAxisSpeedUp) {
          moveLeft("yAxisSpeedUp");
        }

        if (event.gamma > yAxisFastest) {
          moveRight("yAxisFastest");
        }
        if (event.gamma < -yAxisFastest) {
          moveLeft("yAxisFastest");
        }
      }
    };

    $("button").on("click", function() {
      var currentLetter = $(".active-letter").text();

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
    });

    $("input").on("change", function() {
      if (this.name === "spin") {
        yAxisSpin = parseInt(this.value);
      }
      if (this.name === "speedup") {
        yAxisSpeedUp = parseInt(this.value);
      }
      if (this.name === "fastest") {
        yAxisFastest = parseInt(this.value);
      }
      if (this.name === "allow-movement") {
        XAxisAllowsMovement = parseInt(this.value);
      }

      if (this.name === "spin-speed") {
        spinSpeed = parseInt(this.value);
      }
      if (this.name === "speedup-speed") {
        speedUpSpeed = parseInt(this.value);
      }
      if (this.name === "fastest-speed") {
        fastestSpeed = parseInt(this.value);
      }
    });
  });