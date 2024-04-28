let world1;

const p = (p) => {
  let seed = 0;
  let tilesetImage;
  let currentGrid = [];
  let numRows, numCols;

  p.preload = () => {
    tilesetImage = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
    );
  };

  p.reseed = () => {
    seed = (seed | 0) + 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    p.select("#seedReport").html("seed " + seed);
    p.regenerateGrid();
  };

  p.regenerateGrid = () => {
    p.select("#asciiBox").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  };

  p.reparseGrid = () => {
    currentGrid = p.stringToGrid(p.select("#asciiBox").value());
  };

  p.gridToString = (grid) => {
    let rows = [];
    for (let i = 0; i < grid.length; i++) {
      rows.push(grid[i].join(""));
    }
    return rows.join("\n");
  };

  p.stringToGrid = (str) => {
    let grid = [];
    let lines = str.split("\n");
    for (let i = 0; i < lines.length; i++) {
      let row = [];
      let chars = lines[i].split("");
      for (let j = 0; j < chars.length; j++) {
        row.push(chars[j]);
      }
      grid.push(row);
    }
    return grid;
  };

  p.setup = () => {
    numCols = p.select("#asciiBox").attribute("rows") | 0;
    numRows = p.select("#asciiBox").attribute("cols") | 0;

    p.createCanvas(16 * numCols, 16 * numRows).parent("canvas-container");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton").mousePressed(p.reseed);
    p.select("#asciiBox").input(p.reparseGrid);

    p.reseed();
  };

  p.draw = () => {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  };

  p.placeTile = (i, j, ti, tj) => {
    p.image(
      tilesetImage,
      16 * j,
      16 * i,
      16,
      16,
      8 * ti,
      8 * tj,
      8,
      8
    );
  };

  let lasttime = 0;
  let interval = 2000;
  let currentstate = 1;
  
  let lasttime2 = 0;
  let interval2 = 1000;
  let currentstate2 = 1;
  
  p.generateGrid = (numCols, numRows) => {
  // Define the range within which the smaller region can be placed
  const minX = 0;
  const maxX = numCols - 1; // Ensure the region fits within the grid
  const minY = 0;
  const maxY = numRows - 1;
  
      // Define the boundaries of the smaller region using random values
      const smallerRegionStartX = p.floor(p.random(minX, maxX - 2));
      const smallerRegionEndX = p.floor(p.random(smallerRegionStartX + 5, maxX + 1)); // Ensure endX is greater than startX
      const smallerRegionStartY = p.floor(p.random(minY, maxY - 2));
      const smallerRegionEndY = p.floor(p.random(smallerRegionStartY + 5, maxY + 1)); // Ensure endY is greater than startY
      const hallnumber = p.floor(p.random(1, 5));
      let hallX, hallY;
      if (hallnumber === 1) {
        hallX = p.floor(p.random(smallerRegionStartY + 1, smallerRegionEndY));
      }
      if (hallnumber === 2) {
        hallX = p.floor(p.random(smallerRegionStartY + 1, smallerRegionEndY));
      }
      if (hallnumber === 3) {
        hallY = p.floor(p.random(smallerRegionStartX + 1, smallerRegionEndX));
      }
      if (hallnumber === 4) {
        hallY = p.floor(p.random(smallerRegionStartX + 1, smallerRegionEndX));
      }
  
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
          } else if (hallnumber === 2 && j === hallX && i >= smallerRegionEndX) {
            row.push(',');
          } else if (hallnumber === 3 && i === hallY && i <= smallerRegionStartY) {
            row.push(',');
          } else if (hallnumber === 4 && i === hallY && i >= smallerRegionEndY) {
            row.push(',');
          } else {
            // Outside the smaller region, use '_'
            row.push("_");
          }
        }
        grid.push(row);
      }
      return grid;
    };
  
    p.drawGrid = (grid) => {
      p.background(128);
  
      let currenttime = p.millis();
      if (currenttime - lasttime > interval) {
        lasttime = currenttime;
        currentstate = (currentstate === 1) ? 2 : 1;
      }
      let currenttime2 = p.millis();
      if (currenttime2 - lasttime2 > interval2) {
        lasttime2 = currenttime2;
        currentstate2 = (currentstate2 === 1) ? 4 : 1;
      }
  
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          if (p.gridCheck(grid, i, j, ',')) {
            p.placeTile(i, j, 21, 21);
          } else p.drawContext(grid, i, j, ",", 0, 0);
          if (p.gridCheck(grid, i, j, '_')) {
            p.placeTile(i, j, 20, 23);
            let randomCheck2 = p.random(1) <= 0.015;
            if (randomCheck2 === true) {
              p.placeTile(i, j, 7, 16 + currentstate);
            } else {
              p.placeTile(i, j, 20, 23);
            }
          } else {
            p.drawContext(grid, i, j, ",", 0, 0);
            if (p.gridCode(grid, i, j, ',') === 15) {
              let randomCheck1 = p.random(1) <= 0.01;
              if (randomCheck1 === true) {
                p.placeTile(i, j, 6 - currentstate2, 28);
              }
            }
            if (p.gridCode(grid, i, j, ',') === 7) {
              let randomCheck3 = p.random(1) <= 0.1;
              if (randomCheck3 === true) {
                p.placeTile(i, j, 28 - currentstate, 25);
              }
            }
          }
        }
      }
    };
  
    p.gridCheck = (grid, i, j, target) => {
      if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length) {
        if (grid[i][j] === target) {
          return true;
        }
      }
      return false;
    }

    p.gridCode = (grid, i, j, target) => { //gives the tile a code that is specific to the tiles that are next to it
      let northBit = p.gridCheck(grid,i,j-1,target)
      let southBit = p.gridCheck(grid,i,j+1,target)
      let eastBit = p.gridCheck(grid,i+1,j,target)
      let westBit = p.gridCheck(grid,i-1,j,target)
      
      return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
    }    
    
    p.drawContext = (grid,i,j,target,ti,tj) => { //places new tiles based on the surrounding tiles
      let code = p.gridCode(grid,i,j,target) //creates the code for the tile
      const [tiOffset, tjOffset] = lookup[code]; //finds the correct offset using the index of the code
      p.placeTile(i,j,ti + tiOffset, tj + tjOffset); //takes the offset and adds it to the existing offset
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
};

world1 = new p5(p, "canvas-container");
