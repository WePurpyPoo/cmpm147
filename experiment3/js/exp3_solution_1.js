/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  // Define the range within which the smaller region can be placed
  const minX = 0;
  const maxX = numCols - 1; // Ensure the region fits within the grid
  const minY = 0;
  const maxY = numRows - 1;

  // Define the boundaries of the smaller region using random values
  const smallerRegionStartX = floor(random(minX, maxX-2));
  const smallerRegionEndX = floor(random(smallerRegionStartX + 5, maxX + 1)); // Ensure endX is greater than startX
  const smallerRegionStartY = floor(random(minY, maxY-2));
  const smallerRegionEndY = floor(random(smallerRegionStartY + 5, maxY + 1)); // Ensure endY is greater than startY
  const hallnumber = floor(random(1,5));
  let hallX,hallY;
  if (hallnumber === 1) {
    hallX = floor(random(smallerRegionStartY + 1,smallerRegionEndY))
  }
  if (hallnumber === 2) {
    hallX = floor(random(smallerRegionStartY + 1,smallerRegionEndY))
  } 
  if (hallnumber === 3) {
    hallY = floor(random(smallerRegionStartX + 1,smallerRegionEndX))
  }
  if (hallnumber === 4) {
    hallY = floor(random(smallerRegionStartX + 1,smallerRegionEndX))
  }
  // pick a number between 1 and 4 to determine the direction
  // find a point between the 2 corners to create a hallway using random
  // make another coordinate point at the end of the grid so it can fill the rest of it
  
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Check if (i, j) falls within the smaller region
      if (i >= smallerRegionStartX && i <= smallerRegionEndX &&
          j >= smallerRegionStartY && j <= smallerRegionEndY) {
        // Use ',' within the smaller region
        row.push(",");
      } else if (hallnumber === 1 && j === hallX && i <= smallerRegionStartX) { 
        row.push(',');
        console.log("1")
      } else if (hallnumber === 2 && j === hallX && i >= smallerRegionEndX) {
        row.push(',');
        console.log("2")
      } else if (hallnumber === 3 && i === hallY && i <= smallerRegionStartY) {
        row.push(',');
        console.log("3")
      } else if (hallnumber === 4 && i === hallY && i >= smallerRegionEndY) {
        row.push(',');
        console.log("4")
      } else {
        // Outside the smaller region, use '_'
        row.push("_");
      }
    }
    grid.push(row);
  }
  return grid;
}

let lasttime = 0
let interval = 2000
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
    currentstate2 = (currentstate2 === 1) ? 4:1;
  }
  

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (gridCheck(grid,i,j,',')) {
        placeTile(i, j, 21, 21);
      } else drawContext(grid,i,j,",",0,0);
      if (gridCheck(grid,i,j,'_')) {
        placeTile(i, j, 20, 23)
        let randomCheck2 = random(1) <= 0.015
        if (randomCheck2 === true){
          placeTile(i,j,7,16+currentstate)
        } else {
          placeTile(i, j, 20, 23);
        }
      } else {
        drawContext(grid,i,j,",",0,0);
        if (gridCode(grid,i,j,',') === 15){
          let randomCheck1 = random(1) <= 0.01
          if (randomCheck1 === true){
            placeTile(i,j,6-currentstate2,28)
          }
        }
        if (gridCode(grid,i,j,',') === 7){
          let randomCheck3 = random(1) <= 0.1
          if (randomCheck3 === true){
            placeTile(i,j,28-currentstate,25)
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
  [21,21], // by itself
  [21,21], // left is same 
  [21,21], // right is same
  [21,21], // left and right are same
  [21,21], // south is same
  [27, 21], // top right corner
  [25, 21], // top left corner
  [26, 21], // top
  [21,21], // north is same
  [27, 23], // bottom right corner
  [25, 23], // bottom left corner
  [26, 23], // bottom
  [21, 21], // top and bottom are same
  [27, 22], // right wall
  [25, 22], // left wall
  [21,21], // middle
];
