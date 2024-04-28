"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let RedHandN, RedHandS, RedHandE, RedHandW, tissueBox, noteBook, mewo1, mewo2, WHITESPACE;
let tissueBoxY, tissueBoxX, noteBookX, noteBookY, mewoX, mewoY, roomStartX, roomStartY, roomEndX, roomEndY;
let lasttime = 0
let interval = 2000
let currentstate = 1
//steps
//1. make every tile white except the middle
//2. Add images to the middle
//3. Add animation to Mewo
//4. at the absolute value of both x and y, start generating random red hands scattered around
//5. if the user clicks on a red hand they get teleported back to the start



function p3_preload() {
  console.log("preloading images...")
  RedHandN = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/RED_HANDS_SPRITE.png?v=1714249523240')
  RedHandS = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/RED_HANDS_SPRITE_S.png?v=1714267508141')
  RedHandE = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/RED_HANDS_SPRITE_E.png?v=1714267508997')
  RedHandW = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/RED_HANDS_SPRITE_W.png?v=1714267508407')
  tissueBox = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/whitespacetissue.png?v=1714252874039')
  noteBook = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/whitespacenotebook.png?v=1714254964424')
  mewo1 = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/whitespacemewo1.png?v=1714258654903')
  mewo2 = loadImage('https://cdn.glitch.global/292869fa-b95d-4ff2-bf56-d84c17f0395f/whitespacemewo2.png?v=1714258655219')
}
function p3_setup() {
  document.getElementById("playButton").addEventListener("click", function() {
    let audio = document.getElementById("audio");
    audio.volume -= 0.95
    audio.play().catch(function(error) {
      console.error("Error playing audio:", error);
    });
  });
}


let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  // Define the size of the room
  roomStartX = floor(random(3,8)); // Adjust as needed
  roomStartY = floor(random(3,8)); // Adjust as needed
  roomEndX = floor(random(-8,-3)); // Adjust as needed
  roomEndY = floor(random(-8,-3)); // Adjust as needed
  tissueBoxX = floor(random(roomEndX,roomStartX))
  tissueBoxY = floor(random(roomEndY,roomStartY))
  noteBookX = (floor(random(roomEndX,roomStartX)))
  noteBookY = (floor(random(roomEndY,roomStartY)))
  mewoX = floor(random(roomEndX, roomStartX))
  mewoY = floor(random(roomEndY, roomStartY))
  let tileCheck = true
  while (tileCheck === true) {
    if (noteBookX === tissueBoxX) {
      noteBookX = floor(random(roomEndX,roomStartX));
    }
    if (noteBookY === tissueBoxY) {
      noteBookY = floor(random(roomEndY,roomStartY));
    }
    if (mewoX === noteBookX || mewoX === tissueBoxX) {
      mewoX = floor(random(roomEndX, roomStartX))
    }
    if (mewoY === tissueBoxY || mewoY === noteBookY) {
      mewoY = floor(random(roomEndY, roomStartY))
    }
    else {
      tileCheck = false
    }
  }
}



function p3_tileWidth() {
  return 16;
}
function p3_tileHeight() {
  return 8;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let hands = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  if (hands[key] === 1) {
    resetCamera()
  }
}

function p3_drawBefore() {
  background(255);
}
function p3_drawTile(i, j) {
  stroke(0);
  let key = [i-1,j-1]
  if (XXH.h32("hands:" + [i, j], worldSeed) % 70 == 0){
    if (Math.abs(i) > 30 && Math.abs(j) > 30){
      if (i < 0 && j > 0) {
        image(RedHandE, -10, -35, 25, 25)
        hands[[key]] = 1
      }
      if (i > 0 && j > 0) {
        image(RedHandS, -10, -35, 25, 25)
        hands[[key]] = 1
      }
      if (i < 0 && j < 0) {
        image(RedHandN, -10, -35, 25, 25)
        hands[[key]] = 1
      }
      if (i > 0 && j < 0) {
        image(RedHandW, -10, -35, 25, 25)
        hands[[key]] = 1
      }
    } 
  }
    
  
  // Draw the rectangular room using a for loop
  if (i <= roomStartX && i >= roomEndX && 
      j <= roomStartY && j >= roomEndY){
    beginShape();
    vertex(-tw, 0);
    vertex(0, th);
    vertex(tw, 0);
    vertex(0, -th);
    endShape(CLOSE);
  }
  
  push();
  noStroke();
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  let currenttime = millis();
  if (currenttime - lasttime > interval) {
    lasttime = currenttime
    currentstate = (currentstate === 1) ? 2:1;
  }
  
  if (i === tissueBoxX && j === tissueBoxY) {
    image(tissueBox, -10, -15)
  }
  if (i === noteBookX && j === noteBookY) {
    image(noteBook, -10, -15)
  }
  if (i === mewoX && j === mewoY) {
    if (currentstate === 1){
      image(mewo1, -10, -15)
    }
    if (currentstate === 2){
      image(mewo2, -10, -15)
    }
  }
  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  
  let n = hands[[i,j]]

  noStroke();
  fill(0);
  if (i === tissueBoxX && j === tissueBoxY) {
    text("Tissues " + [i,j],0 ,0 )
  }
  else if (i === noteBookX && j === noteBookY) {
    text("Notebook " + [i,j],0 ,0 )
  }
  else if (i === mewoX && j === mewoY) {
    text("Mewo " + [i,j],0 ,0 )
  }
  else if (n === 1) {
    text("Red Hand " + [i,j],   0, 0)
  }
  else {
    text("Tile " + [i, j], 0, 0); 
  }
  
}

function p3_drawAfter() {}