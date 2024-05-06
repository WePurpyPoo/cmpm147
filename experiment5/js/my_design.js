/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */
window.currentShape = 'ellipse';
function p4_inspirations() {
    return [ 
      {
        name: "Yam Moment",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/yammoment.png?v=1714499193513",
        credit: "i drew it :D"
      },
  
      {
        name: "Bewni Happy",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/bewnihapy.png?v=1714499217669",
        credit: "Bewni drew this :O"
      },
  
      {
        name: "Thuwunkyface",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/thuwunkyface.png?v=1714677907788",
        credit: "i drew it :D"
      },
      {
        name: "WePurpyPoo",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/WeFurryPooInnocentStare.png?v=1714499324142",
        credit: "I drew it :D",
      },
      {
        name: "WePurpyPoo2",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/WFP8.22.2023.03.png?v=1714856536056",
        credit: "I drew it :D"
      },
      {
        name: "Celebi",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/Screenshot%202024-03-10%20015116.png?v=1714786861310",
        credit: "I drew it :D",
      },
      {
        name: "Mr Beast",
        assetUrl: "https://cdn.glitch.global/b89fa0bf-0d63-4b82-9f9e-e17e3a74028d/mrbeast.png?v=1714856179565",
        credit: "Skitzy in Squid Game vs. MrBeast - Rap Battle! - ft. Cam Steady & Mike Choe 2021"
      }
    ];
  }
  
  function p4_initialize(inspiration) {
    let canvasContainer = $('.image-container'); 
    let canvasWidth = canvasContainer.width(); 
    let aspectRatio = inspiration.image.height / inspiration.image.width;
    let canvasHeight = canvasWidth * aspectRatio;
    if (inspiration.name === "Celebi") {
        resizeCanvas(canvasWidth/4, canvasHeight/4) 
        const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/4}px;">`
        $('#original').empty();
        $('#original').append(imgHTML);
  } else {
    resizeCanvas(canvasWidth/2, canvasHeight/2);
    const imgHTML = `<img src="${inspiration.assetUrl}" style="width:${canvasWidth/2}px;">`
    $('#original').empty();
    $('#original').append(imgHTML);
  }
    $('.caption').text(inspiration.credit)
    let design = {
      background: 100,
      foreground: [],
    }
    inspiration.image.loadPixels();

    if (window.currentShape == 'spikey') {
      for(let i = 0; i < 50; i++){
        // Get color data from the image at random positions
        let x = floor(random(inspiration.image.width));
        let y = floor(random(inspiration.image.height));
        let index = (x + y * inspiration.image.width) * 4; // Calculate the index of the pixel
    
        // Extract color data from the pixel
        let red = inspiration.image.pixels[index];
        let green = inspiration.image.pixels[index + 1];
        let blue = inspiration.image.pixels[index + 2];
        let brightness = (red + green + blue) / 3;
        let shapeSize = map(brightness, 0, 255, 5, 0)
        let shapeX = map(x, 0, inspiration.image.width, 0, width)
        let shapeY = map(y, 0, inspiration.image.height, 0, height)
        let opacity = random(255);
        let a = inspiration.image.pixels[index + 3]; // Alpha value of the pixel
        
        // Check if the pixel is fully transparent
        if (a === 0) {
          continue; // Skip drawing the shape if the pixel is fully transparent
        }    
        design.foreground.push({x: shapeX,
          y: shapeY,
          size: shapeSize,
          w: random(width / 2),
          h: random(height/ 2),
          s: random(50),
          rotation: random(10),
          fill: [red,green,blue,opacity]})
      }
    } else {
    for(let i = 0; i < 300; i++){
      // Get color data from the image at random positions
      let x = floor(random(inspiration.image.width));
      let y = floor(random(inspiration.image.height));
      let index = (x + y * inspiration.image.width) * 4; // Calculate the index of the pixel
  
      // Extract color data from the pixel
      let red = inspiration.image.pixels[index];
      let green = inspiration.image.pixels[index + 1];
      let blue = inspiration.image.pixels[index + 2];
      let brightness = (red + green + blue) / 3;
      let shapeSize = map(brightness, 0, 255, 5, 0)
      let shapeX = map(x, 0, inspiration.image.width, 0, width)
      let shapeY = map(y, 0, inspiration.image.height, 0, height)
      let opacity = random(255);
      let a = inspiration.image.pixels[index + 3]; // Alpha value of the pixel
      
      // Check if the pixel is fully transparent
      if (a === 0) {
        continue; // Skip drawing the shape if the pixel is fully transparent
      }    
      design.foreground.push({x: shapeX,
        y: shapeY,
        size: shapeSize,
        w: random(width / 2),
        h: random(height/ 2),
        s: random(50),
        rotation: random(10),
        fill: [red,green,blue,opacity]})
    }
  }
    return design;
  }
  
  function p4_render(design, inspiration) {
    background(design.background);
    for (let shapes of design.foreground) {
      noStroke();
      //rotate(radians(shapes.rotation));
      fill(shapes.fill)
      if(window.currentShape == 'ellipse'){
        ellipse(shapes.x,shapes.y,shapes.w,shapes.h);
      } else if (window.currentShape == 'rectangle'){
        rect(shapes.x,shapes.y,shapes.w,shapes.h);
      } else {
        drawSpikeyBall(shapes.x,shapes.y,shapes.w/3,shapes.h);
      }
      
    }
  }
  
  function p4_mutate(design, inspiration, rate) {
    for (let shapes of design.foreground) {
      shapes.x = mut(shapes.x, 0, width, rate)
      shapes.y = mut(shapes.y, 0, height, rate)
      shapes.w = mut(shapes.w, 0, width/2, rate)
      shapes.h = mut(shapes.h, 0, height/2, rate)
      shapes.fill[0] = mut(shapes.fill[0], shapes.fill[0] - 30, shapes.fill[0] + 30, rate)
      shapes.fill[1] = mut(shapes.fill[1], shapes.fill[1] - 30, shapes.fill[1] + 30, rate)
      shapes.fill[2] = mut(shapes.fill[2], shapes.fill[2] - 30, shapes.fill[2] + 30, rate)
      shapes.fill[3] = mut(shapes.fill[3], shapes.fill[3] - 30, shapes.fill[3] + 30, rate)
    }
  }
  
  function mut(num, min, max, rate) {
    return constrain(randomGaussian(num, (rate * (max - min)) / 20), min, max);
  }
  
  function drawSpikeyBall(x, y, radius, spikeDepth) {
    beginShape();
    for (let angle = 0; angle < 360; angle += 1) {
        // Calculate the modulation of the radius based on the angle
        let radiusVariation = sin(angle * 10) * spikeDepth;
        let modRadius = radius + radiusVariation;

        // Calculate vertex coordinates
        let vx = x + cos(angle) * modRadius;
        let vy = y + sin(angle) * modRadius;
        vertex(vx, vy);
    }
    endShape(CLOSE);
}