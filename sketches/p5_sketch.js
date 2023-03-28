// Import sketch objects

const canvasSketch = require('canvas-sketch');
const p5 = require('p5');
new p5();
const horizontal = 30 * 300;
const vertical = 20 * 300;

const settings = {
	// Pass the p5 instance, and preload function if necessary
	p5: true,
	dimensions: [horizontal, vertical],
	units: 'px',
	duration: 30,
	animate: true,
	fps: 60,
	attributes: {
		antialias: true,
	},
};

let backgroundImg;
let reflectionImg;
window.preload = () => {
	// Preload sounds/images/etc...
	//backgroundImg = loadImage('media/images/sunset2.png');
	//reflectionImg = loadImage('media/images/reflection4.png');
};

canvasSketch((context, bleed, trimWidth, trimHeight) => {
	// Sketch setup => Like p5.js 'setup' function
	let waves = [];
	let clouds = [];
	let xoff = 0.0;
	let yoff = 0.01;

	colorMode(HSB, 360, 100, 100, 100);
	background(0, 0, 10);

	// Create objects
	for (let i = 0; i < 150; i++) {
		const rdnX = random(0, width / 2);
		waves.push(new Waves(xoff, yoff, rdnX));
	}

	// Create objects
	for (let i = 0; i < 25; i++) {
		const rdnX = random(0, width / 2);
		clouds.push(new Clouds(xoff, yoff, rdnX));
	}

	background(199, 47, 89);

	/* 	image(backgroundImg, 0, 0, width, height / 2, 0, 0, 1024, 1024 / 2);
	image(reflectionImg, 0, height / 2, width, height / 2, 0, 0, 1376, 864); */

	// Define gradient colors
	let c1 = color(200, 60, 100); // Light blue
	let c2 = color(180, 80, 80); // White
	let c3 = color(220, 60, 70);
	let c4 = color(180, 60, 100);
	// Create gradient
	setGradient(0, 0, width, height / 2, c1, c2, 'Y');
	setGradient(0, height / 2, width, height / 2, c3, c4, 'Y');

	let sunW = random(width / 10, width / 6);
	let sunX = random(sunW, width - sunW);
	let sunY = random(sunW, height / 2 - sunW);
	displaySun(sunW, sunX, sunY);

	blendMode(SOFT_LIGHT);
	for (let i = 0; i < 1500; i++) {
		for (let i = 0; i < clouds.length; i++) {
			clouds[i].move();
			clouds[i].display();
		}
	}
	blendMode(BLEND);
	displaySunReflection(sunW, sunX, sunY);
	for (let i = 0; i < 1500; i++) {
		for (let i = 0; i < waves.length; i++) {
			waves[i].move();
			waves[i].display();
		}
	}

	// createTexture();

	// Return a renderer, which is like p5.js 'draw' function
	return ({p5, time, width, height, context, exporting, bleed, trimWidth, trimHeight}) => {
		exporting = true;

		if (!exporting && bleed > 0) {
			stroke(0, 100, 100);
			noFill();
			strokeWeight(10);
			rect(bleed, bleed, trimWidth, trimHeight);
		}
	};
}, settings);

function setGradient(x, y, w, h, c1, c2, axis) {
	noFill();
	if (axis === 'Y') {
		// Top to bottom gradient
		for (let i = y; i <= y + h; i++) {
			let inter = map(i, y, y + h, 0, 1);
			let c = lerpColor(c1, c2, inter);
			stroke(c);
			line(x, i, x + w, i);
		}
	}
}
function createTexture() {
	let texture = [];

	for (let index = 0; index < 5000; index++) {
		const rdnX = random(600, width + 600);
		const rdnY = random(600, height + 600);
		const rdnW1 = random(5, 150);
		texture[index] = new Smudge(rdnX, rdnY, rdnW1);
		texture[index].display();
	}
}

function displaySun(sunW, sunX, sunY) {
	blendMode(HARD_LIGHT);
	noStroke();
	fill(340, 50, 100, 100);
	//arc(sunX, sunX, sunW, sunW, PI, 0, OPEN);
	//arc(sunX, sunY, sunW, sunW, 0, PI, OPEN);
	ellipse(sunX, sunY, sunW);
	blendMode(BLEND);
}

function displaySunReflection(sunW, sunX, sunY) {
	blendMode(OVERLAY);
	let restriction = 5;
	let alpha = 35;
	let refX = sunX;
	let refY = height / 2;
	let refW = sunW;
	let refH = 20;
	let x = refX;
	let xoff = 0.5;
	let yoff = 0.01;
	for (let index = 0; index < 8000; index++) {
		x = map(noise(xoff + refX), 0, 1, refX - sunW / restriction, refX + sunW / restriction);
		noStroke();
		fill(340, 50, 100, alpha);
		ellipse(x, refY, refW, refH);
		alpha += random(-0.05, 0.049);
		restriction -= 0.3;
		xoff += 5.6;
		yoff += 0.01;
		refY += 0.9;
		refW += random(-1.75, 1.23);
		refH += random(-0.065, 0.063);
		if (alpha <= 0.2) {
			alpha = 0.2;
		}
		if (refH <= 1) {
			refH = 1;
		}
		if (refW <= 1) {
			refW = 1;
		}
		if (restriction <= 1) {
			restriction = 1;
		}
	}

	//arc(sunX, height / 2 - 20, sunW, sunW * 4, 0, PI, OPEN);
	blendMode(BLEND);
}
// Jitter class
class Waves {
	constructor(xoff, yoff, rdnx) {
		this.rdnx = rdnx;
		this.rdny = height / 2;
		this.xoff = xoff;
		this.yoff = yoff;
		this.x = rdnx;
		this.height = random(5, 60);
		this.width = this.height;
		this.speed = 5;
		this.yIncrement = 0.1;
		this.strokeHue = 30;
		this.strokeSat = 60;
		this.strokeBright = 100;
		this.strokeAlpha = 0;
		this.strokeWeight = 100;

		this.fillHue = 210;
		this.fillSat = 100;
		this.fillBright = 90;
		this.fillAlpha = 1;
	}

	move() {
		this.x = map(noise(this.xoff + this.rdnx), 0, 1, -width, width * 2);
		this.rdny = this.rdny + this.yIncrement;
		this.xoff += 0.02;
		this.yoff += 0.001;
		this.yIncrement *= 1.01;
		this.height *= 1.001;
		this.width *= 1.005;

		this.fillBright -= 0.01;
		this.fillHue -= 0.02;
		this.fillSat += 0.01;
		this.fillAlpha += 0.21;

		this.strokeWeight -= 0.15;
		this.strokeHue += 0.0025;
		this.strokeAlpha += 0.015;
		this.strokeSat -= 0.012;
		this.strokeBright -= 0.001;

		let threshold = random(10, 30);

		if (this.fillSat >= random(60, 70)) {
			this.fillSat = 40;
		}
		if (this.fillHue >= random(210, 220)) {
			this.fillHue = 160;
		}
		if (this.fillAlpha >= threshold) {
			this.fillAlpha = random(1, 5);
		}
		if (this.strokeWeight <= 0.5) {
			this.strokeWeight = 0.5;
		}
		if (this.strokeAlpha >= threshold) {
			this.strokeAlpha = random();
		}
	}

	display() {
		strokeWeight(this.strokeWeight);
		stroke(this.strokeHue, this.strokeSat, this.strokeBright, this.strokeAlpha);
		fill(this.fillHue, this.fillSat, this.fillBright, this.fillAlpha);
		ellipse(this.x, this.rdny, this.width, this.height);
	}
}

class Clouds {
	constructor(xoff, yoff, rdnx) {
		this.rdnx = rdnx;
		this.rdny = height / 2;
		this.xoff = xoff;
		this.yoff = yoff;
		this.x = rdnx;
		this.height = random(5, 60);
		this.width = this.height;
		this.speed = 5;
		this.yIncrement = 0.1;
		this.strokeHue = 210;
		this.fillSat = 60;
		this.fillHue = 10;
	}

	move() {
		this.x = map(noise(this.xoff + this.rdnx), 0, 1, -width, width * 2);
		this.rdny = this.rdny - this.yIncrement;
		this.xoff += 0.02;
		this.yoff += 0.001;
		this.yIncrement *= 1.009;
		this.height *= random(1, 1.001);
		this.width *= random(1.005, 1.01);
		this.strokeHue += 0.025;
		this.fillHue += 0.2;
		this.fillSat -= 0.003;
		if (this.fillSat >= random(30, 40)) {
			//this.fillSat = random(15, 20);
		}
		if (this.fillHue >= random(15, 25)) {
			this.fillHue = 10;
		}
	}

	display() {
		strokeWeight(2);
		stroke(this.fillHue, this.fillSat, 90, 30);
		fill(this.fillHue, this.fillSat, 100, 15);
		ellipse(this.x, this.rdny, this.width, this.height);
	}
}

export default class Smudge {
	constructor(rdnX, rdnY, w1) {
		this.xoff = 0;
		this.yoff = 1;
		this.woff1 = 0;
		this.rdnX = rdnX;
		this.rdnY = rdnY;
		this.rdnW1 = w1;
		this.alpha = random(15, 60);
	}

	display() {
		for (let index = 0; index < 500; index++) {
			this.xoff += 0.03;
			this.yoff += 0.02;
			this.woff1 += 0.0055;

			const w1 = map(noise(this.woff1 + this.rdnW1), 0, 1, 1, 3);
			const x = map(noise(this.xoff + this.rdnX), 0, 1, -width / 3, width * 1.5);
			const y = map(noise(this.yoff + this.rdnY), 0, 1, -height / 3, height * 1.5);

			fill(0, 0, 100, this.alpha);
			noStroke();
			ellipse(x, y, w1, w1);
		}
	}
}
