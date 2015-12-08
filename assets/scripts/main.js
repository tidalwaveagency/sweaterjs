var sweaterJS = (function () {

  var canvas = document.getElementById("canvas");
  var context = document.getElementById('canvas').getContext('2d');
  var imageSrcs = {
    "red": ["images/pixels/0.jpg",
            "images/pixels/1.jpg",
            "images/pixels/2.jpg",
            "images/pixels/3.jpg",
            "images/pixels/4.jpg",
            "images/pixels/5.jpg",
            "images/pixels/6.jpg",
            "images/pixels/7.jpg"],
    "blue": ["images/pixels/blue/0.jpg",
             "images/pixels/blue/1.jpg",
             "images/pixels/blue/2.jpg",
             "images/pixels/blue/3.jpg",
             "images/pixels/blue/4.jpg",
             "images/pixels/blue/5.jpg",
             "images/pixels/blue/6.jpg",
             "images/pixels/blue/7.jpg"]
  };

  var tileData = {
    "width": 8,
    "height": 6
  };

  var offset = {
    "width": 0,
    "height": 0
  };

  var images = {
    "red": [],
    "blue": []
  };

  function loadImages(src, name) {
    var remaining = src.length;
    var img;
    for (var i = 0; i < src.length; i++) {
      img = new Image();
      img.onload = function() {
        --remaining;
        if (remaining <= 0) {
          loaded();
        }
      };
      img.src = src[i];
      images[name].push(img);
    }
  }

  function initialize() {
    loadImages(imageSrcs.red, 'red');
    loadImages(imageSrcs.blue, 'blue');
  }

  function loaded(){
    $('#preloader').hide();
    for (var i = 0; i < 1920; i+= tileData.width) {
      tile(letterData.spacer, 'red');
    }
    offset.width = 0;
    offset.height = 40 * tileData.height;
    for (var i = 0; i < 1920; i+= tileData.width) {
      tile(letterData.spacer, 'red');
    }
  }

  function lineLength(el){
    var length = 0;
    for (var i = 0; i < el.length; i++) {
      if (letterData[el.charAt(i).toLowerCase()] !== undefined) {
        length += letterData[el.charAt(i).toLowerCase()].width * tileData.width;
      }
    }
    return length;
  }

  function getColor(){
    return $('.colorRadio:checked').val();
  }

  function onKeyUp(){

    var lineOne = document.getElementById("lineOne").value;
    var lineTwo = document.getElementById("lineTwo").value;

    var color = getColor();

    var lineOneSize = lineLength(lineOne),
        lineTwoSize = lineLength(lineTwo);

    var lineOneLeftover = 0,
        lineTwoLeftover = 0;

    context.clearRect(0, 0, canvas.width, canvas.height);

    offset.width = 0;
    offset.height = 0;

    lineOneLeftover = 1920 - lineOneSize;

    for (var i = 0; i < canvas.width/28; i++) {
      tile(trimData.boat, color);
    }

    offset.height += trimData.boat.height * tileData.height;
    offset.width = 0;

    for (var i = 0; i < lineOneLeftover/4; i+= tileData.width) {
      tile(letterData.spacer, color);
    }

    for (var i = 0; i < lineOne.length; i++) {
      if (letterData[lineOne.charAt(i).toLowerCase()] !== undefined) {
        tile(letterData[lineOne.charAt(i).toLowerCase()], color);
      }
    }

    for (var i = 0; i < lineOneLeftover/4; i+= tileData.width) {
      tile(letterData.spacer, color);
    }

    if (lineTwo.length > 0) {
      offset.width = 0;
      offset.height += 40 * tileData.height;

      lineTwoLeftover = 1920 - lineTwoSize;

      for (var i = 0; i < lineTwoLeftover/4; i+= tileData.width) {
        tile(letterData.spacer, color);
      }

      for (var i = 0; i < lineTwo.length; i++) {
        if (letterData[lineTwo.charAt(i).toLowerCase()] !== undefined) {
          tile(letterData[lineTwo.charAt(i).toLowerCase()], color);
        }
      }

      for (var i = 0; i < lineTwoLeftover/4; i+= tileData.width) {
        tile(letterData.spacer, color);
      }

    } else {
      offset.width = 0;
      offset.height = 40 * tileData.height;
      for (var i = 0; i < 1920; i+= tileData.width) {
        tile(letterData.spacer, color);
      }
    }
  }

  function tile(character, color) {
    var data;
    if (color === 'red') {
      for(c=0; c<character.width; c++) {
        for(r=0; r<character.height; r++) {
          context.drawImage(images.red[character.data[r][c]],
          offset.width + tileData.width * c, offset.height + tileData.height * r,
          tileData.width, tileData.height);
        }
      }
    } else if (color === 'blue') {
      for(c=0; c<character.width; c++) {
        for(r=0; r<character.height; r++) {
          context.drawImage(images.blue[character.data[r][c]],
          offset.width + tileData.width * c, offset.height + tileData.height * r,
          tileData.width, tileData.height);
        }
      }
    }
    offset.width += character.width * tileData.width;
  }

  function postImageToFacebook( authToken, filename, mimeType, imageData, message ) {
      // this is the multipart/form-data boundary we'll use
      var boundary = '----ThisIsTheBoundary1234567890';
      // let's encode our image file, which is contained in the var
      var formData = '--' + boundary + '\r\n';
      formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
      formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
      for ( var i = 0; i < imageData.length; ++i )
      {
          formData += String.fromCharCode( imageData[ i ] & 0xff );
      }
      formData += '\r\n';
      formData += '--' + boundary + '\r\n';
      formData += 'Content-Disposition: form-data; name="message"\r\n\r\n';
      formData += message + '\r\n';
      formData += '--' + boundary + '--\r\n';

      var xhr = new XMLHttpRequest();
      xhr.open( 'POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true );
      xhr.onload = xhr.onerror = function() {
          console.log( xhr.responseText );
      };
      xhr.setRequestHeader( "Content-Type", "multipart/form-data; boundary=" + boundary );
      if(!xhr.sendAsBinary){
          xhr.sendAsBinary = function(datastr) {
              function byteValue(x) {
                  return x.charCodeAt(0) & 0xff;
              }
              var ords = Array.prototype.map.call(datastr, byteValue);
              var ui8a = new Uint8Array(ords);
              this.send(ui8a.buffer);
          };
      }
      xhr.sendAsBinary( formData );
  }

  function postCanvasToFacebook() {
  	var data = canvas.toDataURL("image/png");
  	var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
  	var decodedPng = Base64Binary.decode(encodedPng);
  	FB.getLoginStatus(function(response) {
  	  if (response.status === "connected") {
  		postImageToFacebook(response.authResponse.accessToken, "uglysweater", "image/png", decodedPng, "www.tidalwave.christmas");
  	  } else if (response.status === "not_authorized") {
  		 FB.login(function(response) {
  			postImageToFacebook(response.authResponse.accessToken, "uglysweater", "image/png", decodedPng, "www.tidalwave.christmas");
  		 }, {scope: "publish_actions"});
  	  } else {
  		 FB.login(function(response)  {
  			postImageToFacebook(response.authResponse.accessToken, "uglysweater", "image/png", decodedPng, "www.tidalwave.christmas");
  		 }, {scope: "publish_actions"});
  	  }
  	 });

  }

  // Reveal public pointers to
  // private functions and properties

  return {
      keyUp: onKeyUp,
      init: initialize,
      post: postCanvasToFacebook
  };

})();
