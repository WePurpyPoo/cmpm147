const w2 = (p) => {
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
    p.select("#seedReport2").html("seed " + seed);
    p.regenerateGrid();
  };

  p.regenerateGrid = () => {
    p.select("#asciiBox2").value(p.gridToString(p.generateGrid(numCols, numRows)));
    p.reparseGrid();
  };

  p.reparseGrid = () => {
    currentGrid = p.stringToGrid(p.select("#asciiBox2").value());
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
    numCols = p.select("#asciiBox2").attribute("rows") | 0;
    numRows = p.select("#asciiBox2").attribute("cols") | 0;

    p.createCanvas(16 * numCols, 16 * numRows).parent("canvas-container2");
    p.select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

    p.select("#reseedButton2").mousePressed(p.reseed);
    p.select("#asciiBox2").input(p.reparseGrid);

    p.reseed();
  };


  p.draw = () => {
    p.randomSeed(seed);
    p.drawGrid(currentGrid);
  };

  p.placeTile = (i, j, ti, tj) => {
    p.image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
  };

  p.generateGrid = (numCols, numRows) => {
    // Define the range within which the smaller region can be placed
    let isVertical = p.random(1) > 0.5;
    let lakeStartX, lakeStartY, lakeEndX, lakeEndY;

    if (isVertical === true) {
      let rectWidth = p.floor(p.random(3, 8));
      let minX = 0;
      let maxX = numCols - 3;
      lakeStartY = 0;
      lakeEndY = numRows;
      lakeStartX = p.floor(p.random(minX, maxX + 1))
      lakeEndX = lakeStartX + rectWidth - 1
    }
    if (isVertical === false) {
      let rectHeight = p.floor(p.random(3, 8));
      lakeStartX = 0;
      lakeEndX = numCols;
      let minY = 0;
      let maxY = numRows - 3;
      lakeStartY = p.floor(p.random(minY, maxY + 1))
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
  };

  let lasttime = 0;
  let interval = 5000;
  let currentstate = 1;

  let lasttime2 = 0;
  let interval2 = 1000;
  let currentstate2 = 1;

  p.drawGrid = (grid) => {
    p.background(128);

    let currenttime = p.millis();
    if (currenttime - lasttime > interval) {
      lasttime = currenttime
      currentstate = (currentstate === 1) ? 2 : 1;
    }
    let currenttime2 = p.millis();
    if (currenttime2 - lasttime2 > interval2) {
      lasttime2 = currenttime2
      currentstate2 = (currentstate2 === 1) ? 2 : 1;
    }


    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (p.gridCheck(grid, i, j, ',')) {
          p.placeTile(i, j, (p.floor(p.random(17, 20))), 18);
        } else p.drawContext(grid, i, j, ",", 4, 0);
        if (p.gridCheck(grid, i, j, '_')) {
          p.placeTile(i, j, (p.floor(p.random(4))), 0)
          let randomCheck2 = p.random(1) <= 0.015
          if (randomCheck2 === true) {
            p.placeTile(i, j, 26, currentstate)
          } else {
            p.placeTile(i, j, (p.floor(p.random(4))), 0);
          }
        } else {
          p.drawContext(grid, i, j, ",", 4, 0);
          if (p.gridCode(grid, i, j, ',') === 15) {
            let randomCheck1 = p.random(1) <= 0.05
            if (randomCheck1 === true) {
              p.placeTile(i, j, 17 - currentstate2 * 2, 20 - currentstate2)
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
  };



  p.gridCode = (grid, i, j, target) => { //gives the tile a code that is specific to the tiles that are next to it
    let northBit = p.gridCheck(grid, i, j - 1, target)
    let southBit = p.gridCheck(grid, i, j + 1, target)
    let eastBit = p.gridCheck(grid, i + 1, j, target)
    let westBit = p.gridCheck(grid, i - 1, j, target)

    return (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
  };

  p.drawContext = (grid, i, j, target, ti, tj) => { //places new tiles based on the surrounding tiles
    let code = p.gridCode(grid, i, j, target) //creates the code for the tile
    const [tiOffset, tjOffset] = lookup[code]; //finds the correct offset using the index of the code
    p.placeTile(i, j, ti + tiOffset, tj + tjOffset); //takes the offset and adds it to the existing offset
  };


  const lookup = [
    [1, 1], // by itself
    [0, 1], // left is same 
    [2, 1], // right is same
    [12, 1], // left and right are same
    [12, 1], // south is same
    [7, 0], // top right corner
    [5, 0], // top left corner
    [6, 0], // top
    [1, 2], // north is same
    [7, 2], // bottom right corner
    [5, 2], // bottom left corner
    [6, 2], // bottom
    [12, 1], // top and bottom are same
    [7, 1], // right wall
    [5, 1], // left wall
    [15, 18], // middle
  ];

}

let world2 = new p5(w2, "canvas-container2");
