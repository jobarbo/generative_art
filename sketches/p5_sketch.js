// Import sketch objects
import Ball from './ball.js';
import * as dat from 'dat.gui';
const palettes = require('nice-color-palettes/1000.json');
const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();

// Setup the canvas
const horizontal = 10 * 300;
const vertical = 10 * 300;

const gui = new dat.GUI({closed: false});

const settings = {
	// Pass the p5 instance, and preload function if necessary
	p5: true,
	dimensions: [horizontal, vertical],
	units: 'px',
	//duration: 30,
	//fps: 60,
	animate: true,
	attributes: {
		antialias: true,
	},
};

// Optionally preload before you load the sketch
window.preload = () => {
	// Preload sounds/images/etc...
};

canvasSketch((context, bleed, trimWidth, trimHeight) => {
	// Sketch setup => Like p5.js 'setup' function
	colorMode(HSB, 360, 100, 100, 100);

	let chosenPalette = palettes[Math.floor(Math.random() * palettes.length)];
	let backgroundColor = color(chosenPalette[Math.floor(Math.random() * chosenPalette.length)]);
	let ballColor = complementaryColor(backgroundColor);

	/* 	// choose the color of the balls from the same palette as backgroundColor but not the same color as backgroundColor
	let ballColor = color(chosenPalette[Math.floor(Math.random() * chosenPalette.length)]); */

	while (ballColor.toString() === backgroundColor.toString()) {
		ballColor = color(chosenPalette[Math.floor(Math.random() * chosenPalette.length)]);
	}
	console.log(ballColor.toString());
	console.log(backgroundColor.toString());
	background(backgroundColor);

	/**
	 * GUI Helper
	 */

	// gui.add(module_name, 'x', 0, width, 0.00001);
	// gui.add(module_name, 'y', 0, width, 0.00001);

	// create a new object with the properties you want to control
	let balls = [];
	for (let i = 0; i < 200; i++) {
		balls[i] = new Ball(width / 2, height / 2, int(random(50)), backgroundColor, ballColor);
	}

	/* 	for (let i = 0; i < balls.length; i++) {
		// run a loop while the balls are still on the canvas
		while (balls[i].x > -width / 10 && balls[i].x < width + width / 10 && balls[i].y > -height / 10 && balls[i].y < height + height / 10) {
			balls[i].update();
			balls[i].display();
		}
	} */

	// Return a renderer, which is like p5.js 'draw' function
	return ({p5, time, width, height, context, exporting, bleed, trimWidth, trimHeight}) => {
		for (let i = 0; i < balls.length; i++) {
			// run a loop while the balls are still on the canvas

			balls[i].update();
			balls[i].display();
		}
		exporting = true;
		if (!exporting && bleed > 0) {
			stroke(0, 100, 100);
			noFill();
			strokeWeight(10);
			rect(bleed, bleed, trimWidth, trimHeight);
		}
	};
}, settings);

// make a function to chose a random color that is somewhat complementary to the background color
function complementaryColor(backgroundColor) {
	let h = hue(backgroundColor);
	let s = saturation(backgroundColor);
	let b = brightness(backgroundColor);
	let a = alpha(backgroundColor);
	let complementaryHue = (h + 180) % 360;
	let complementaryColor = color(complementaryHue, s, b, a);
	return complementaryColor;
}
