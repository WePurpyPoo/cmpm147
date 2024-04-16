// sketch.js - Living Impressions
// Author: Joey Longo
// Date: 4-14-24

/* exported setup, draw */

let seed = 0;

const grassColor = "#C2B280";
const skyColor = "#3B05A5";
const duneColor = "#DD8B17";
const treeColor = "#4A392E";
const waterColor = "#60E1EA";

function setup() {
  createCanvas(400, 200);
  createButton("reimagine").mousePressed(() => seed++);
}

function draw() {
  randomSeed(seed);

  background(100);

  noStroke();

  fill(skyColor);
  rect(0, 0, width, height / 2);

  fill(duneColor);
  beginShape();
  let amplitude1 = random(2,5); // Amplitude of the sine wave
  let frequency1 = random(0.002, 0.005); // Frequency of the sine wave
  let phase1 = 0; // Phase shift of the sine wave
  vertex(0, height / 2);
  for (let x = 0; x < width; x++) {
    let y = height / 3 + amplitude1 * sin(TWO_PI * frequency1 * x + phase1);
    vertex(x, y); // Add vertex of the sine wave
  }
  vertex(width, height); // End at the bottom right corner
  endShape(CLOSE);
  
  fill(grassColor);
  rect(0, height / 2, width, height / 2);
  
  fill(waterColor);
  beginShape();
  timeOffset = millis() * 0.002 * random(); // Adjust the speed of movement
  const scrub = mouseX / width;
  vertex(0, height); // Start from the bottom left corner
  let amplitude = 5; // Amplitude of the sine wave
  let frequency = random(0.008, 0.02); // Frequency of the sine wave
  let phase = timeOffset * 0.5 + scrub * TWO_PI; // Phase shift of the sine wave
  for (let x = 0; x < width; x++) {
    let y = height / 1.35 + amplitude * sin(TWO_PI * frequency * x + phase);
    vertex(x, y); // Add vertex of the sine wave
  }
  vertex(width, height); // End at the bottom right corner
  endShape(CLOSE);


  fill(treeColor);
  const trees = 10 * random();
  for (let i = 0; i < trees; i++) {
    let z = random() * 5;
    let x = width * ((random() + (scrub / 50 + millis() / 500000.0) / z) % 1);
    let s = width / 50 / z;
    let y = height / 2 + height / 20 / z;
    // Add a condition to avoid tiny trees in the background
    if (s > 5) {
      if (s < 30) {
        drawSkeletonTree(x, y, s);
      }  
    }
  }
}

function drawSkeletonTree(x, y, s) {
  // Draw the main trunk
  stroke(treeColor);
  strokeWeight(s / 8);
  line(x, y, x, y - s); // Adjust trunk length

  // Draw branches
  let branchCount = int(random(3, 6));
  for (let i = 0; i < branchCount; i++) {
    let angle = random(PI / 6, 5 * PI / 6); // Corrected angle range for upwards branches
    let branchLength = s * random(0.3, 0.7); // Adjust branch length
    let startY = random(y - s, y - s / 2); // Random starting point along trunk's height
    let endX = x + branchLength * cos(angle);
    let endY = y - branchLength * 4*sin(angle);
    line(x, startY, endX, endY); // Connect branches to the trunk
  }
}
