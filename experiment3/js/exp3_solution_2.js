/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  // Define the range within which the smaller region can be placed
  let isVertical = random(1) > 0.5;
  let lakeStartX, lakeStartY, lakeEndX, lakeEndY;
  
  if (isVertical === true) {
    let rectWidth = floor(random(3,8));
    let minX = 0;
    let maxX = numCols - 3;
    lakeStartY = 0;
    lakeEndY = numRows;
    lakeStartX = floor(random(minX,maxX+1))
    lakeEndX = lakeStartX + rectWidth - 1
  }
  if (isVertical === false) {
    let rectHeight = floor(random(3,8));
    lakeStartX = 0;
    lakeEndX = numCols;
    let minY = 0;
    let maxY = numRows - 3;
    lakeStartY = floor(random(minY,maxY+1))
    lakeEndY = lakeStartY + rectHeight - 1
  }
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Check if (i, j) falls within the smaller region
      if (i >= lakeStartX && i <= lakeEndX &&
          j >= lakeStartY && j <= lakeEndY) {
        // Use ',' within the smaller region
        row.push(",");
      } else {
        // Outside the smaller region, use '_'
        row.push("_");
      }
    }
    grid.push(row);
  }
  
  return grid;
}

// Pseudocode grid
// Create boolean out of a random number generator < 0.5 = true, > 0.5 = false
// if statement for if true then create random width from 2-6
// if false, create random height from 2-6
// create minX maxX or minY maxY depending on which if statement is true (min is 0, max is numCols/Rows - 3)
// pick a random number between the min and the max and make that one of the corners.
// if that number is greater than 15, subtract the width/height to make the other corner, if it less than 16, add the width/height to make the other corner
// to make the other two corners, take the existing corner coordinates and add 31 to the other coordinate, like adding 31 to the y value if the x value was the one that was already changed
// fill in the rest of the area

let lasttime = 0
let interval = 5000
let currentstate = 1

let lasttime2 = 0
let interval2 = 1000
let currentstate2 = 1

function drawGrid(grid) {
  background(128);
  
  let currenttime = millis();
  if (currenttime - lasttime > interval) {
    lasttime = currenttime
    currentstate = (currentstate === 1) ? 2:1;
  }
  let currenttime2 = millis();
  if (currenttime2 - lasttime2 > interval2) {
    lasttime2 = currenttime2
    currentstate2 = (currentstate2 === 1) ? 2:1;
  }
  

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,',')) {
        placeTile(i, j, (floor(random(17,20))), 18);
      } else drawContext(grid,i,j,",",4,0);
      if (gridCheck(grid,i,j,'_')) {
        placeTile(i, j, (floor(random(4))), 0)
        let randomCheck2 = random(1) <= 0.015
        if (randomCheck2 === true){
          placeTile(i,j,26,currentstate)
        } else {
          placeTile(i, j, (floor(random(4))), 0);
        }
      } else {
        drawContext(grid,i,j,",",4,0);
        if (gridCode(grid,i,j,',') === 15){
          let randomCheck1 = random(1) <= 0.05
          if (randomCheck1 === true){
            placeTile(i,j,17-currentstate2*2,20-currentstate2)
          }
        }
      }
    }
  }
}

function gridCheck(grid, i, j, target) {
  if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
    if (grid[i][j] === target) {
      return true;
    }
  }
  return false;
}



function gridCode(grid, i, j, target) { //gives the tile a code that is specific to the tiles that are next to it
  let northBit = gridCheck(grid,i,j-1,target)
  let southBit = gridCheck(grid,i,j+1,target)
  let eastBit = gridCheck(grid,i+1,j,target)
  let westBit = gridCheck(grid,i-1,j,target)
  
  return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
}    

function drawContext(grid,i,j,target,ti,tj) { //places new tiles based on the surrounding tiles
  let code = gridCode(grid,i,j,target) //creates the code for the tile
  const [tiOffset, tjOffset] = lookup[code]; //finds the correct offset using the index of the code
  placeTile(i,j,ti + tiOffset, tj + tjOffset); //takes the offset and adds it to the existing offset
}
  

const lookup = [
  [1,1], // by itself
  [0,1], // left is same 
  [2,1], // right is same
  [12, 1], // left and right are same
  [12,1], // south is same
  [7, 0], // top right corner
  [5, 0], // top left corner
  [6, 0], // top
  [1,2], // north is same
  [7, 2], // bottom right corner
  [5, 2], // bottom left corner
  [6, 2], // bottom
  [12, 1], // top and bottom are same
  [7, 1], // right wall
  [5, 1], // left wall
  [15,18], // middle
];
