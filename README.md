# HW09

Experiment with ml5.js to create funny camera filter effects.

I'm detecting faces and then exaggerating the eyes.

In order to do this, I have to first get the center of the each eye and also a rough radius.

The center of each eye is the average X and Y positions for all of the eye's points.

The radius can be calculated by using the annotated points ```leftEyebrowUpper[7]``` and ```rightEyebrowUpper[7]``` as the point that is further from the center of each eye.

To make the lipstick effect I just collected all of the lip points and created a shape using them as vertex. I thought I 
might have to separate them, or create triangles out of them, but just the default effect was good enough as a 
prototype/proof-of-concept.
