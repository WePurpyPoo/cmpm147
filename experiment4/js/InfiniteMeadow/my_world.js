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

var Redtulip, Pinktulip, Cornflower, Allium, Dandelion, Oxeyedaisy;
let flowerType;
let flowerType2;
//steps
//1. Get images to load
//2. When the users click, have the flowers cycle through
//3. change text on tiles to say name of the flower
//4. add random flowers


function p3_preload() {
  console.log("preloading images...")
  Redtulip = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Redtulip.png?v=1714107206021')
  Pinktulip = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Pink_Tulip.png?v=1714107222310')
  Cornflower = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Cornflower.png?v=1714107232747')
  Allium = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Allium.png?v=1714107237092')
  Dandelion = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Dandelion.png?v=1714107246872')
  Oxeyedaisy = loadImage('https://cdn.glitch.global/78e9dc82-5fc4-455b-bb9a-d0b88fad3330/Oxeyedaisy.png?v=1714107267656')
}
function p3_setup() {
}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  clicks = {};
  flowerType = floor(random(1, 7)); // Random flower type (keys from 1 to 6)
  flowerType2 = floor(random(1,7));
  let flowerLoop = true
  while (flowerLoop === true) {
    if (flowerType2 === flowerType)
      flowerType2 = floor(random(1,7));
    else {
      flowerLoop = false
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

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  
  clicks[key] = 1 + (clicks[key] | 0);
  if (clicks[key] === 7) {
    clicks[key] = 0
  }
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(102, 174, 105);
  } else {
    fill(118, 180, 121);
  }
  
  let n = clicks[[i, j]] | 0;
  if (XXH.h32("flowering:" + [i,j], worldSeed) % 32 == 0) {
    if (n === 0) {
      let typeRoll = floor(random(1,3))
      if (typeRoll === 1) {
        for (let x = 0; x < flowerType2; x++)
          p3_tileClicked(i,j)
      }
      if (typeRoll === 2) {
        for (let x = 0; x < flowerType; x++) {
          p3_tileClicked(i,j)
        }
      }
    }
  }
  
  push();
  
  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);
  

  //if (n === 0) {
  if (n === 1) {
    image(Redtulip,-25,-35,50,50);
  }
  if (n === 2) {
    image(Dandelion,-25,-35,50,50);
  }
  if (n === 3) {
    image(Cornflower,-25,-35,50,50);
  }
  if (n === 4) {
    image(Oxeyedaisy,-25,-35,50,50);
  }
  if (n === 5) {
    image(Allium,-25,-35,50,50);
  }
  if (n === 6) {
    image(Pinktulip,-25,-35,50,50);
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

  noStroke();
  fill(0);
  let n = clicks[[i, j]] | 0;
  if (n === 1) {
    text("Red Tulip " + [i, j], 0, 0);
  }
  if (n === 2) {
    text("Dandelion " + [i, j], 0, 0);
  }
  if (n === 3) {
    text("Cornflower " + [i, j], 0, 0)
  }
  if (n === 4) {
    text("Oxeye Daisy " + [i, j], 0, 0)
  }
  if (n === 5) {
    text("Allium " + [i, j], 0, 0)
  }
  if (n === 6) {
    text("Pink Tulip " + [i, j], 0, 0)
  }
  if (n === 0) {
    text("Tile " + [i, j], 0, 0);
  } 
}

function p3_drawAfter() {}
