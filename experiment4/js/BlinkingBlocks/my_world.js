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

let blockStart, blockEnd;
let block1time,block2time, block1color, block2color, star;
let lasttime = 0
let interval = 4000
let currentstate = 1
//steps
//1. create a width where the blocks are created and the rest is blank
//2. create a function that determines which blocks are where
//2.1 create block object that has the color value and the timing
//2.2 use the hash function to seperate those blocks to be block1 or block2 
//3. add little stars in the empty space
//4. add animation to stars
//5. add blinking for when the tiles are about to disappear



function p3_preload() {
  console.log("preloading images...")
  star = loadImage('https://cdn.glitch.global/71ae38c3-bb97-4c48-ab24-d4214b439fc3/star.png?v=1714286893624')
}
function p3_setup() {
}


let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
  block1color = random(["#B35BD8","#9EFBFF","#FFB7F0","#4CE26D","#FEE039","#F9B467","#D71A1A","#794ACC","#E7DDFF","#5DCA06"]);
  block1time = floor(random(1,3));
  block2color = random(["#B35BD8","#9EFBFF","#FFB7F0","#4CE26D","#FEE039","#F9B467","#D71A1A","#794ACC","#E7DDFF","#5DCA06"]);
  if (block1time === 1) {
    block2time = 2
  } else {
    block2time = 1
  }
  let check = true
  while (check === true) {
    if (block1color === block2color){
      block2color = random(["#B35BD8","#9EFBFF","#FFB7F0","#4CE26D","#FEE039","#F9B467","#D71A1A","#794ACC","#E7DDFF","#5DCA06"]);
    } else {
      check = false
    } 
  }
}


function p3_tileWidth() {
  return 32;
}
function p3_tileHeight() {
  return 16;
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
  background(0);
}
function p3_drawTile(i, j) {
  push();
  stroke(0);
  let currenttime = millis();
  let elapsedinInterval = currenttime - lasttime
  if (elapsedinInterval > interval) {
    lasttime = currenttime
    currentstate = (currentstate === 1) ? 2:1;
  }
  
  blockStart = -4
  blockEnd = -1
  if (XXH.h32("blocks:" + [i, j], worldSeed) % 7 == 0) {
    if (j <= blockEnd && j >= blockStart){
      if (XXH.h32("time:" + [i,j], worldSeed) % 2 == 0){
        if (currentstate === block1time){
          if (elapsedinInterval >= 5/8 * interval && elapsedinInterval <= 6/8 * interval || 
              elapsedinInterval >= 6/8 * interval && elapsedinInterval <= 7/8 * interval 
              || elapsedinInterval >=  7/8 * interval && elapsedinInterval < interval){
            let fadeOut = 500
            let blockAlpha = 255 * (1 - (millis() % fadeOut) / fadeOut);
            fill(255,blockAlpha)
          } else {
            fill(block1color) 
          }
          beginShape();
          vertex(-tw, 0);
          vertex(0, th);
          vertex(tw, 0);
          vertex(0, -th);
          endShape(CLOSE);
        }
      }else if (currentstate === block2time) {
        if (elapsedinInterval >= 5/8 * interval && elapsedinInterval <= 6/8 * interval || 
              elapsedinInterval >= 6/8 * interval && elapsedinInterval <= 7/8 * interval 
              || elapsedinInterval >=  7/8 * interval && elapsedinInterval < interval){
          let fadeOut = 500
          let blockAlpha = 255 * (1 - (millis() % fadeOut) / fadeOut);
          fill(255,blockAlpha)
        } else {
          fill(block2color) 
        }
        beginShape();
        vertex(-tw, 0);
        vertex(0, th);
        vertex(tw, 0);
        vertex(0, -th);
        endShape(CLOSE);
      }
    }
  }
  let fadeInterval = XXH.h32('fadeInterval:' + [i, j], worldSeed) % 3000 + 2000; // Random fade interval between 2 and 5 seconds
  
  if (XXH.h32('twinkling:' + [i, j], worldSeed) % 212 == 0){
    if (j > blockEnd || j < blockStart){
      let currentAlpha = 255 * (1 - (millis() % fadeInterval) / fadeInterval);
      tint(255,currentAlpha)
      image(star, -10,-20, 20, 20)
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


  noStroke();
  fill(255);
  text("Tile " + [i, j], 0, 0); 

  
}

function p3_drawAfter() {}