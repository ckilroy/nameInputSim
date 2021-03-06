arcDegrees = 450;
startingDegree = 270;
numCharacters = 27;
letterSpacingDelta = (arcDegrees / numCharacters);
movementDelta = letterSpacingDelta / 500;
positionArray = [];
degreesOver180 = arcDegrees - 180;
percentOfCircleOver = degreesOver180 / arcDegrees;
numCharactersToHide = Math.ceil(numCharacters * percentOfCircleOver);
firstLoad = true;
charSelector = 1;

// Axis
yAxisSpin = 10;
yAxisSpeedUp = 20;
yAxisFastest = 30;
XAxisAllowsMovement = 60;



var setPositions = function() {
  for (i = 0; i < numCharacters; i++) {
    positionArray.push(startingDegree);

    if (startingDegree + letterSpacingDelta > 360) {
      startingDegree = letterSpacingDelta + startingDegree - 360;
    } else {
      startingDegree += letterSpacingDelta;
    }
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

  if (firstLoad) {
    if (idx > numCharacters - numCharactersToHide) {
      $(element).addClass("hide-letter");
    }
  }

  if ((rotationDegrees > (360 - letterSpacingDelta / 2)) || (rotationDegrees < letterSpacingDelta / 2)) {
    $(element).addClass("active-letter");
    var rotationString = "rotate(" + 0 + "deg)";
    $(element).css("transform", rotationString);
  } else {
    $(element).removeClass("active-letter");
  }
}

var setRightPositions = function(yAxisTilt) {
  var rightDelta;

  if (yAxisTilt === "yAxisSpin") {
    rightDelta = movementDelta;
  }
  if (yAxisTilt === "yAxisSpeedUp") {
    rightDelta = movementDelta + 0.1;
  }
  if (yAxisTilt === "yAxisFastest") {
    rightDelta = movementDelta + 0.1;
  }

  var newpositions = positionArray.map(function(num) {
    var newDegree;
    
    if (num + rightDelta > 360) {
      newDegree = num + rightDelta - 360;
    } else {
      newDegree = num + rightDelta;
    }

    return newDegree;
  });
  positionArray = newpositions;
}

var setLeftPositions = function(yAxisTilt) {
  var leftDelta;

  if (yAxisTilt === "yAxisSpin") {
    leftDelta = movementDelta;
  }
  if (yAxisTilt === "yAxisSpeedUp") {
    leftDelta = movementDelta + 0.1;
  }

  var newpositions = positionArray.map(function(num) {
    var newDegree;
    
    debugger

    if ((num - leftDelta) < 0) {
      newDegree = arcDegrees;
    } else {
      newDegree = num - leftDelta;
    }

    return newDegree;
  });
  positionArray = newpositions;
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
    // debugger
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
  // 
  // $("button").on("click", function() {
  //   var currentLetter = $(".active-letter").text();
  // 
  //   if (currentLetter !== "<") {
  //     $(".char" + charSelector).text(currentLetter);
  //     if (charSelector < 9) {
  //       charSelector += 1;
  //     }
  //   } else {
  //     $(".char" + (charSelector - 1)).text("_");
  //     if (charSelector > 1) {
  //       charSelector -= 1;
  //     }
  //   }
  // });
  // 
  // $("input").on("change", function() {
  //   if (this.name === "spin") {
  //     yAxisSpin = parseInt(this.value);
  //   }
  //   if (this.name === "speedup") {
  //     yAxisSpeedUp = parseInt(this.value);
  //   }
  //   if (this.name === "fastest") {
  //     yAxisFastest = parseInt(this.value);
  //   }
  //   if (this.name === "allow-movement") {
  //     XAxisAllowsMovement = parseInt(this.value);
  //   }
  // });
});