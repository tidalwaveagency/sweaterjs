//Font Loader
WebFontConfig = {
  google: { families: [ 'Lato:400,700:latin', 'Merriweather:400,700:latin' ] }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

function dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

function generateID() {
    return Math.random().toString(36).substr(2,9);
}

function fbShare() {
  var typedArray = dataURItoBlob(canvasFile.toDataURL("image/jpeg"));
  if (typedArray) {
      results.innerHTML = '';
      //Object key will be facebook-USERID#/FILE_NAME
      var objKey = 'facebook-' + fbUserId + '/' + generateID() + '.jpeg';
      var params = {
          Key: objKey,
          ContentType: "image/jpeg",
          Body: typedArray,
          ACL: 'public-read'
      };
      bucket.putObject(params, function (err, data) {
          if (err) {
              results.innerHTML = 'ERROR: ' + err;
          } else {
            var queryString;
            if ($('#lineOne').val.length > 0) {
              queryString = 'l1=' + encodeURI(document.getElementById("lineOne").value);
            }
            if ($('#lineTwo').val.length > 0) {
              queryString += '&l2=' + encodeURI(document.getElementById("lineTwo").value);
            }
            if ($('#lineTwo').val.length > 0) {
              queryString += '&l3=' + encodeURI(document.getElementById("lineThree").value);
            }
            console.log(queryString);
            FB.ui({
              method: 'share',
              picture: 'http://tidalwave.sweaters.s3.amazonaws.com/' + objKey,
              link: 'www.tidalwave.christmas/index.html?' + queryString,
              href: 'www.tidalwave.christmas/index.html?' + queryString,
              description: 'Ugly Sweater from Tidalwave',
              caption: 'Some caption',
              type: 'photo'
            }, function(response){});
          }
      });
  } else {
      results.innerHTML = 'Nothing to upload.';
  }
}

var appId = '1702389059994802';
var roleArn = 'arn:aws:iam::038199334885:role/sweaterStorage';
var bucketName = 'tidalwave.sweaters';

AWS.config.region = 'us-west-2';

var fbUserId;

var bucket = new AWS.S3({
  params: {
    Bucket: bucketName
  }
});

var canvasFile = document.getElementById('canvas');
var shareButton = document.getElementById('share-button');
var results = document.getElementById('results');
shareButton.addEventListener('click', function () {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      bucket.config.credentials = new AWS.WebIdentityCredentials({
          ProviderId: 'graph.facebook.com',
          RoleArn: roleArn,
          WebIdentityToken: response.authResponse.accessToken
      });
      fbUserId = response.authResponse.userID;
      fbShare();
    } else if (response.status === 'not_authorized') {
      login();
    } else {
      login();
    }
  });
}, false);

/*!
 * Login to your application using Facebook.
 * Uses the Facebook SDK for JavaScript available here:
 * https://developers.facebook.com/docs/javascript/gettingstarted/
 */
window.fbAsyncInit = function () {
  FB.init({
    appId: appId,
    status: true,
    cookie: true,
  });
};

function login() {
  FB.login(function (response) {
      bucket.config.credentials = new AWS.WebIdentityCredentials({
          ProviderId: 'graph.facebook.com',
          RoleArn: roleArn,
          WebIdentityToken: response.authResponse.accessToken
      });
      fbUserId = response.authResponse.userID;
      fbShare();
  });
}

 // Load the Facebook SDK asynchronously

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/all.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

var sweaterJS = (function () {

  var canvas  = document.getElementById("canvas"),
      context = document.getElementById('canvas').getContext('2d'),

      inputs  = [
        $('#lineOne'),
        $('#lineTwo'),
        $('#lineThree'),
      ],

      sweaterData = {
        "topEdge"   : {
          "width"   : 0,
          "height"  : 0,
          "data"    : []
        },
        "topTrim"   : {
          "width"   : 0,
          "height"  : 0,
          "data"    : []
        },
        "topBorder" : {
          "width"   : 0,
          "height"  : 0,
          "data"    : []
        },
        "l1": {
          "width"  : 0,
          "height" : 0,
          "data"   : []
        },
        "l2": {
          "width"  : 0,
          "height" : 0,
          "data"   : []
        },
        "l3": {
          "width"  : 0,
          "height" : 0,
          "data"   : []
        },
        "bottomBorder": {
          "width"   : 0,
          "height"  : 0,
          "data"    : []
        },
        "bottomTrim": {
          "width"  : 0,
          "height" : 0,
          "data"   : []
        },
        "bottomEdge": {
          "width"  : 0,
          "height" : 0,
          "data"   : []
        }
      },

      imgSrcs = {
        "red": [
          "images/pixels/0.jpg",
          "images/pixels/1.jpg",
          "images/pixels/2.jpg",
          "images/pixels/3.jpg",
          "images/pixels/4.jpg",
          "images/pixels/5.jpg",
          "images/pixels/6.jpg",
          "images/pixels/7.jpg"
        ],
        "blue": [
          "images/pixels/blue/0.jpg",
          "images/pixels/blue/1.jpg",
          "images/pixels/blue/2.jpg",
          "images/pixels/blue/3.jpg",
          "images/pixels/blue/4.jpg",
          "images/pixels/blue/5.jpg",
          "images/pixels/blue/6.jpg",
          "images/pixels/blue/7.jpg"
        ],
        "tag": [
          "images/tag.png"
        ]
      },

      canvasData = {
        "width": 0,
        "height": 0
      },

      tileData = {
        "width": 8,
        "height": 6
      },

      offset = {
        "width": 0,
        "height": 0
      },

      imgs = {
        "red": [],
        "blue": [],
        "tag": [],
      },

      imgsInverted = {
        "red": [],
        "blue": []
      };

  function loadImgs(src, name) {
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
      imgs[name].push(img);
    }
  }

  function invertImgs(name) {
    imgsInverted[name].push(imgs[name][2]);
    imgsInverted[name].push(imgs[name][3]);
    imgsInverted[name].push(imgs[name][0]);
    imgsInverted[name].push(imgs[name][1]);
    imgsInverted[name].push(imgs[name][6]);
    imgsInverted[name].push(imgs[name][7]);
    imgsInverted[name].push(imgs[name][4]);
    imgsInverted[name].push(imgs[name][5]);
  }

  function init() {
    loadImgs(imgSrcs.red, 'red');
    loadImgs(imgSrcs.blue, 'blue');
    loadImgs(imgSrcs.tag, 'tag');
    invertImgs('red');
  }

  function loaded(){
    setTimeout(function(){
      $('#preloader').hide();
      $('body').removeClass('loading');
    }, 2000);
    processQueryStrings();
    render();
  }

  function processQueryStrings() {
    inputs[0].val(decodeURI(getQueryString('l1')));
    inputs[1].val(decodeURI(getQueryString('l2')));
    inputs[2].val(decodeURI(getQueryString('l3')));
    if (inputs[0].val === '' && inputs[1].val === '' && inputs[2].val === '') {
      inputs[0].val("Merry Christmas");
    }
  }

  function getQueryString(key) {
    var re = new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
    var r=[], m;
    while ((m = re.exec(document.location.search)) !== null) r.push(m[1]);
    return r;
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

  function proccessLineData(line, container) {
    container.width = 0;
    container.height = 0;
    container.data = [];
    if (line.length > 0) {
      for (var i = 0; i < line.length; i++) {
        if (letterData[line.charAt(i).toLowerCase()] !== undefined) {
          container.data.push(letterData[line.charAt(i).toLowerCase()]);
          container.width += letterData[line.charAt(i).toLowerCase()].width;
          container.height = Math.max(letterData[line.charAt(i).toLowerCase()].height, container.height);
        }
      }
    }
  }

  function proccessTrimData(character, container, targetLength) {
    if (character.width + container.width <= targetLength) {
      container.data.push(character);
      container.width += character.width;
      container.height = Math.max(container.height, character.height);
    }
    return character.width;
  }

  function resetContainer(container) {
    container.width  = 0;
    container.height = 0;
    container.data   = [];
  }

  function proccessTrim(targetLength) {

    var count = 0;

    resetContainer(sweaterData.topTrim);

    while (count < targetLength) {
        count += proccessTrimData(trimData.tree, sweaterData.topTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.cane, sweaterData.topTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.flake, sweaterData.topTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.cane, sweaterData.topTrim, targetLength);
        if(count >= targetLength) {break;}
    }

    addPadding(sweaterData.topTrim, trimData.spacer, targetLength);

    count = 0;
    resetContainer(sweaterData.bottomTrim);

    while (count < targetLength) {
        count += proccessTrimData(trimData.tree, sweaterData.bottomTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.cane, sweaterData.bottomTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.flake, sweaterData.bottomTrim, targetLength);
        if(count >= targetLength) {break;}
        count += proccessTrimData(trimData.cane, sweaterData.bottomTrim, targetLength);
        if(count >= targetLength) {break;}
    }

    addPadding(sweaterData.bottomTrim, trimData.spacer, targetLength);

    count = 0;
    resetContainer(sweaterData.topBorder);

    while (count < targetLength) {
        count += proccessTrimData(trimData.top, sweaterData.topBorder, targetLength);
        if(count >= targetLength) {break;}
    }

    count = 0;
    resetContainer(sweaterData.bottomBorder);

    while (count < targetLength) {
        count += proccessTrimData(trimData.bottom, sweaterData.bottomBorder, targetLength);
        if(count >= targetLength) {break;}
    }

    count = 0;
    resetContainer(sweaterData.topEdge);

    while (count < targetLength) {
        count += proccessTrimData(trimData.topEdge, sweaterData.topEdge, targetLength);
        if(count >= targetLength) {break;}
    }

    count = 0;
    resetContainer(sweaterData.bottomEdge);

    while (count < targetLength) {
        count += proccessTrimData(trimData.bottomEdge, sweaterData.bottomEdge, targetLength);
        if(count >= targetLength) {break;}
    }
  }

  function addPadding(container, padding, targetLength){
    while(container.width < targetLength) {
      container.data.push(padding);
      container.data.unshift(padding);
      container.width += padding.width * 2;
    }
  }

  function getSweaterData() {
    var longestLine = 0;

    proccessLineData(inputs[0].val(), sweaterData.l1);
    proccessLineData(inputs[1].val(), sweaterData.l2);
    proccessLineData(inputs[2].val(), sweaterData.l3);

    longestLine = Math.max(sweaterData.l1.width, sweaterData.l2.width, sweaterData.l3.width) + 20;

    if (longestLine <= 20) {
      proccessLineData("Merry Christmas", sweaterData.l1);
      longestLine += sweaterData.l1.width;
    }

    if (longestLine > 20 && longestLine < 120) {
      longestLine += 100;
    }

    addPadding(sweaterData.l1, letterData.spacer, longestLine);
    addPadding(sweaterData.l2, letterData.spacer, longestLine);
    addPadding(sweaterData.l3, letterData.spacer, longestLine);

    proccessTrim(longestLine);
  }

  function resetCanvas() {
    offset.width = 0;
    offset.height = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function setCanvasSize() {
    canvasData.width = 0;
    canvasData.height = 0;
    for (var section in sweaterData) {
      canvasData.width  = Math.max(sweaterData[section].width, canvasData.width);
      canvasData.height += sweaterData[section].height;
    }
    canvas.width  = canvasData.width * tileData.width;
    canvas.height = canvasData.height * tileData.height;
  }

  function renderSection(section) {
    for(i = 0; i < section.data.length; i++) {
      tile(section.data[i], imgs.red);
    }
    offset.width = 0;
    offset.height += section.height * tileData.height;
  }

  function stitchTag() {
    context.drawImage(imgs.tag[0],
    (canvasData.width * tileData.width/2) - 140, (canvasData.height * tileData.height) - 100,
    280, 120);
  }

  function render() {
    getSweaterData();
    resetCanvas();
    setCanvasSize();
    renderSection(sweaterData.topEdge);
    renderSection(sweaterData.topTrim);
    renderSection(sweaterData.topBorder);
    renderSection(sweaterData.l1);
    renderSection(sweaterData.l2);
    renderSection(sweaterData.l3);
    renderSection(sweaterData.bottomBorder);
    renderSection(sweaterData.bottomTrim);
    renderSection(sweaterData.bottomEdge);
    stitchTag();
  }

  function tile(character, tiles) {
    for(c=0; c<character.width; c++) {
      for(r=0; r<character.height; r++) {
        context.drawImage(tiles[character.data[r][c]],
        offset.width + tileData.width * c, offset.height + tileData.height * r,
        tileData.width, tileData.height);
      }
    }
    offset.width += character.width * tileData.width;
  }

  function save() {
    if(!canvas) return;
    var fname = 'sweater';

    var data = canvas.toDataURL("image/jpeg");
    data = data.substr(data.indexOf(',') + 1).toString();

    var dataInput = document.createElement("input") ;
    dataInput.setAttribute("name", 'imgdata') ;
    dataInput.setAttribute("value", data);
    dataInput.setAttribute("type", "hidden");

    var nameInput = document.createElement("input") ;
    nameInput.setAttribute("name", 'name') ;
    nameInput.setAttribute("value", fname + '.jpeg');

    var myForm = document.createElement("form");
    myForm.method = 'post';
    myForm.action = 'http://default-environment-m93wheffab.elasticbeanstalk.com/save.php';
    myForm.appendChild(dataInput);
    myForm.appendChild(nameInput);

    document.body.appendChild(myForm);
    myForm.submit();
    document.body.removeChild(myForm);
  };

  // Reveal public pointers to
  // private functions and properties

  return {
      init: init,
      render: render,
      save: save
  };

})();
