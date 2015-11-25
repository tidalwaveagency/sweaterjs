var letterData = {
  "m": {
    "width": 14,
    "height": 38,
    "data": [
      [1,5,1,5,0,4,0,4,0,4,1,5,1,5],
      [2,6,2,6,0,4,0,4,0,4,2,6,2,6],
      [2,6,2,6,0,4,0,4,0,5,2,6,2,6],
      [3,6,2,6,0,4,0,4,0,6,2,6,2,7],
      [0,6,2,6,1,4,0,4,0,6,2,6,2,4],
      [0,6,2,6,2,4,0,4,0,6,2,6,2,4],
      [0,6,2,6,2,4,0,4,0,6,2,6,2,4],
      [0,6,2,6,2,4,0,4,1,6,2,6,2,4],
      [0,6,2,6,2,4,0,4,2,6,2,6,2,4],
      [0,6,2,6,2,5,0,4,2,6,2,6,2,4],
      [0,6,2,6,2,6,0,4,2,6,2,6,2,4],
      [0,6,2,6,2,6,0,4,2,6,2,6,2,4],
      [0,6,2,6,2,6,0,5,2,6,2,6,2,4],
      [0,6,2,6,2,6,0,6,2,6,2,6,2,4],
      [0,6,2,7,2,6,1,6,2,6,2,6,2,4],
      [0,6,2,4,2,6,2,6,2,7,2,6,2,4],
      [0,6,2,4,2,6,2,6,2,4,2,6,2,4],
      [0,6,2,4,2,6,2,6,3,4,2,6,2,4],
      [0,6,2,4,2,6,2,6,0,4,2,6,2,4],
      [0,6,2,4,2,6,2,6,0,4,2,6,2,4],
      [0,6,2,4,3,6,2,6,0,4,2,6,2,4],
      [0,6,2,4,0,6,2,7,0,4,2,6,2,4],
      [0,6,2,4,0,6,2,4,0,4,2,6,2,4],
      [0,6,2,4,0,7,3,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [0,6,2,4,0,4,0,4,0,4,2,6,2,4],
      [1,6,2,5,0,4,0,4,0,5,2,6,2,5],
      [2,6,2,6,0,4,0,4,0,6,2,6,2,6],
      [3,7,3,7,0,4,0,4,0,7,3,7,3,7],
      [1,5,1,5,0,4,0,4,0,5,1,5,1,5],
      [3,7,3,7,0,4,0,4,0,7,3,7,3,7],
      [0,4,0,4,0,4,0,4,0,4,0,4,0,4]
    ]
  }
};

var ctx = document.getElementById('canvas').getContext('2d');

// create new image object to use as pattern
var images = [],
    tileTypes = 8,
    tiles = 160;

var imageSrcs = ["images/pixels/0.jpg",
                 "images/pixels/1.jpg",
                 "images/pixels/2.jpg",
                 "images/pixels/3.jpg",
                 "images/pixels/4.jpg",
                 "images/pixels/5.jpg",
                 "images/pixels/6.jpg",
                 "images/pixels/7.jpg"];
var images = [];
var img;
var remaining = imageSrcs.length;

console.log(JSON.stringify(letterData, null, 2));

for (var i = 0; i < imageSrcs.length; i++) {
    img = new Image();
    img.onload = function() {
        --remaining;
        if (remaining <= 0) {
           tile(ctx, images, tiles);
        }
    };
    img.src = imageSrcs[i];
    images.push(img);
}

function loadJSON(callback) {

   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'letters.json', true); // Replace 'my_data' with the path to your file
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}


function tile(context, imgs, tiles) {
  for(c=0; c<letterData.m.width; c++) {
    for(r=0; r<letterData.m.height; r++) {
      console.log('row: ' + r + ' col: ' + c + ' data: ' + letterData.m.data[r][c]);
      context.drawImage(imgs[letterData.m.data[r][c]],
      (imgs[letterData.m.data[r][c]].width)*c, (imgs[letterData.m.data[r][c]].height)*r,
      imgs[letterData.m.data[r][c]].width, imgs[letterData.m.data[r][c]].height);
    }
  }
}
