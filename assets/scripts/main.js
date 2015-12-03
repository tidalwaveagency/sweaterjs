var sweaterJS = (function () {

  var context = document.getElementById('canvas').getContext('2d');

  var offset = {
        "width": 0,
        "height": 0
      };

  var imageSrcsRed =  ["images/pixels/0.jpg",
                       "images/pixels/1.jpg",
                       "images/pixels/2.jpg",
                       "images/pixels/3.jpg",
                       "images/pixels/4.jpg",
                       "images/pixels/5.jpg",
                       "images/pixels/6.jpg",
                       "images/pixels/7.jpg"];

  var imageSrcsBlue =  ["images/pixels/blue/0.jpg",
                        "images/pixels/blue/1.jpg",
                        "images/pixels/blue/2.jpg",
                        "images/pixels/blue/3.jpg",
                        "images/pixels/blue/4.jpg",
                        "images/pixels/blue/5.jpg",
                        "images/pixels/blue/6.jpg",
                        "images/pixels/blue/7.jpg"];
  var imagesRed = [], imagesBlue = [];
  var img;
  var remaining;

  function initialize() {
    remaining = imageSrcsRed.length;
    for (var i = 0; i < imageSrcsRed.length; i++) {
      img = new Image();
      img.onload = function() {
        --remaining;
        if (remaining <= 0) {
          loaded();
        }
      };
      img.src = imageSrcsRed[i];
      imagesRed.push(img);
    }
    remaining = imageSrcsBlue.length;
    for (var i = 0; i < imageSrcsBlue.length; i++) {
      img = new Image();
      img.onload = function() {
        --remaining;
        if (remaining <= 0) {
          loaded();
        }
      };
      img.src = imageSrcsBlue[i];
      imagesBlue.push(img);
    }
  }

  function loaded(){
    $('#preloader').hide();
    for (var i = 0; i < 1920; i+= 16) {
      tile(letterData["spacer"]);
    }
    offset.width = 0;
    offset.height = 38 * 12;
    for (var i = 0; i < 1920; i+= 16) {
      tile(letterData["spacer"]);
    }
  }

  function onKeyUp(e){
    var lineOne = document.getElementById("lineOne").value;
    var lineTwo = document.getElementById("lineTwo").value;
    var color;
    if (document.getElementById('red').checked) {
      color = document.getElementById('red').value;
    }
    if (document.getElementById('blue').checked) {
      color = document.getElementById('blue').value;
    }
    var lineOneSize = 0, lineTwoSize = 0;
    var lineOneLeftover = 0, lineTwoLeftover = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
    offset.width = 0;
    offset.height = 0;
    for (var i = 0; i < lineOne.length; i++) {
      if (letterData[lineOne.charAt(i).toLowerCase()] !== undefined) {
        lineOneSize += letterData[lineOne.charAt(i).toLowerCase()].width * 16;
      }
    }
    lineOneLeftover = 3840 - lineOneSize;

    for (var i = 0; i < lineOneLeftover/4; i+= 16) {
      tile(letterData["spacer"], color);
    }

    for (var i = 0; i < lineOne.length; i++) {
      if (letterData[lineOne.charAt(i).toLowerCase()] !== undefined) {
        tile(letterData[lineOne.charAt(i).toLowerCase()], color);
      }
    }

    for (var i = 0; i < lineOneLeftover/4; i+= 16) {
      tile(letterData["spacer"], color);
    }

    if (lineTwo.length > 0) {
      offset.width = 0;
      offset.height = 38 * 12;

      for (var i = 0; i < lineTwo.length; i++) {
        if (letterData[lineTwo.charAt(i).toLowerCase()] !== undefined) {
          lineTwoSize += letterData[lineTwo.charAt(i).toLowerCase()].width * 16;
        }
      }
      lineTwoLeftover = 3840 - lineTwoSize;

      for (var i = 0; i < lineTwoLeftover/4; i+= 16) {
        tile(letterData["spacer"], color);
      }

      for (var i = 0; i < lineTwo.length; i++) {
        if (letterData[lineTwo.charAt(i).toLowerCase()] !== undefined) {
          tile(letterData[lineTwo.charAt(i).toLowerCase()], color);
        }
      }

      for (var i = 0; i < lineTwoLeftover/4; i+= 16) {
        tile(letterData["spacer"], color);
      }

    } else {
      offset.width = 0;
      offset.height = 38 * 12;
      for (var i = 0; i < 1920; i+= 16) {
        tile(letterData["spacer"], color);
      }
    }
  }

  function tile(character, color) {
    if (color === 'red') {
      for(c=0; c<character.width; c++) {
        for(r=0; r<character.height; r++) {
          context.drawImage(imagesRed[character.data[r][c]],
          offset.width + (imagesRed[character.data[r][c]].width)*c, offset.height + (imagesRed[character.data[r][c]].height)*r,
          imagesRed[character.data[r][c]].width, imagesRed[character.data[r][c]].height);
        }
      }
    } else if (color === 'blue') {
      for(c=0; c<character.width; c++) {
        for(r=0; r<character.height; r++) {
          context.drawImage(imagesBlue[character.data[r][c]],
          offset.width + (imagesBlue[character.data[r][c]].width)*c, offset.height + (imagesBlue[character.data[r][c]].height)*r,
          imagesBlue[character.data[r][c]].width, imagesBlue[character.data[r][c]].height);
        }
      }
    }
    offset.width += character.width * 16;
  }

  // Reveal public pointers to
  // private functions and properties

  return {
      keyUp: onKeyUp,
      init: initialize
  };

})();
