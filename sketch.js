let video;
let predictions = [];
let facemesh;

function sumXY(acc, p) {
  return [acc[0] + p[0], acc[1] + p[1]];
}

class Eye {
  constructor(eyePoints, minX, minY) {
    let eyeSum = eyePoints.reduce(sumXY, [0, 0]);
    this.avg = {
      x: floor(eyeSum[0] / eyePoints.length),
      y: floor(eyeSum[1] / eyePoints.length),
    };

    this.min = {
      x: minX,
      y: minY,
    };

    this.radius = floor(dist(this.avg.x, this.avg.y, this.min.x, this.min.y));
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  // create capture
  video = createCapture(VIDEO);
  video.hide();

  // initialize model
  facemesh = ml5.facemesh(video);

  // add detection callback
  facemesh.on("face", (results) => {
    predictions = results;
  });
}

function draw() {
  background(0);
  image(video, 0, 0);
  video.loadPixels();

  // if detected, process image
  for (let pi = 0; pi < predictions.length; pi++) {
    // left and right eye points
    let leftEyePoints = [];
    let rightEyePoints = [];

    let annotations = predictions[pi].annotations;
    let annKeys = Object.keys(annotations);
    for (let ai = 0; ai < annKeys.length; ai++) {
      let k = annKeys[ai];

      if (k.includes("leftEye")) {
        leftEyePoints = leftEyePoints.concat(annotations[k]);
      } else if (k.includes("rightEye")) {
        rightEyePoints = rightEyePoints.concat(annotations[k]);
      }
    }

    // get average and radius
    let leftEye = new Eye(
      leftEyePoints,
      annotations.leftEyebrowUpper[7][0],
      annotations.leftEyebrowUpper[7][1]
    );

    let rightEye = new Eye(
      rightEyePoints,
      annotations.rightEyebrowUpper[7][0],
      annotations.rightEyebrowUpper[7][1]
    );

    // draw scaled eyes
    push();
    translate(leftEye.avg.x + leftEye.radius / 2, leftEye.avg.y);
    scale(1.5, 1.5);
    noStroke();
    for (let y = -leftEye.radius; y < leftEye.radius; y++) {
      for (let x = -leftEye.radius; x < leftEye.radius; x++) {
        let pd = mag(x, y);
        if (pd < leftEye.radius) {
          let vx = leftEye.avg.x + x;
          let vy = leftEye.avg.y + y;
          let pi = 4 * (vy * video.width + vx);
          let rv = video.pixels[pi + 0];
          let gv = video.pixels[pi + 1];
          let bv = video.pixels[pi + 2];
          fill(rv, gv, bv);
          ellipse(x, y, 2, 2);
        }
      }
    }
    pop();

    push();
    translate(rightEye.avg.x - rightEye.radius / 2, rightEye.avg.y);
    scale(1.5, 1.5);
    noStroke();
    for (let y = -rightEye.radius; y < rightEye.radius; y++) {
      for (let x = -rightEye.radius; x < rightEye.radius; x++) {
        let pd = mag(x, y);
        if (pd < rightEye.radius) {
          let vx = rightEye.avg.x + x;
          let vy = rightEye.avg.y + y;
          let pi = floor(4 * (vy * video.width + vx));
          let rv = video.pixels[pi + 0];
          let gv = video.pixels[pi + 1];
          let bv = video.pixels[pi + 2];
          fill(rv, gv, bv);
          ellipse(x, y, 2, 2);
        }
      }
    }
    pop();
  }
}
