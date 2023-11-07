# HW09

Using ml5.js to detect faces and then exaggerate the eyes.

In order to do this, I have to first get the center of the each eye and also a rough radius.

The center of each eye is the average X and Y positions for all of the eye's points.

The radius can be calculated by using the annotated points ```leftEyebrowUpper``` and ```rightEyebrowUpper``` as the point tht is further from the center of each eye.

