$(window).ready(function() {
  // startingDegree = 0;
  numCharacterSpaces = 27;
  arcDegrees = 360;
  letterSpacingDelta = (arcDegrees / numCharacterSpaces);
  positionArray = [];
  
  var setPositions = function() {
    for (i = 0; i < numCharacterSpaces; i + letterSpacingDelta) {
      positionArray.push(i);
    }
  }
  
  setPositions();

  // var setupClockwise = function(element) {
  //   var rotationString = "rotate(" + startingDegree + "deg)";
  //   $(element).css("transform", rotationString);
  // 
  //   startingDegree += letterSpacingDelta;
  // }
  // 
    $('span').each(function(idx) {
      debugger
      setupClockwise(this, idx);
    });

  // var setupCounterClock = function(element) {
  //   var rotationString = "rotate(" + startingDegree + "deg)";
  //   $(element).css("transform", rotationString);
  // 
  //   startingDegree -= letterSpacingDelta;
  // }
  // 
  // // Initial layout
  // $('span').each(function() {
  //   setupClockwise(this);
  // });
  // 
  // // var changePosition = function(element) {
  // //   if (Math.ceil(startingDegree) >= 360) {
  // //     debugger
  // //     startingDegree = 0;
  // //   }
  // //   setupClockwise2(element);
  // // }
  // 
  // var moveRight = function() {    
  //   $('span').each(function() {
  //         if (Math.ceil(startingDegree) >= 360) {
  //           startingDegree = 0;
  //         }
  //     setupClockwise(this);
  //   });
  // }
  // 
  // $(this).keydown(function(e) {
  //   if (e.which === 39) {
  //     moveRight();
  //   } else if (e.which === 37) {
  //     moveLeft();
  //   }
  // });
})