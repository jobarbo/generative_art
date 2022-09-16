const palettes = require('nice-color-palettes/1000.json');
export default class Dune {
	constructor(x, y, w) {
		this.palettes = ['#d8d8d8', '#e2d9d8', '#ecdad8', '#f5dbd8', '#ffdcd8'];
		console.log(this.palettes);
		this.x = x;
		this.y = y;
		this.w = w;
		this.angle = 45;
		// this.rotationModList = [-0.25, -0.2, -0.15, -0.1, -0.05];
		this.baseColor = color(0, 0, 10);
		this.initialRotationSpeed = 0.15;
		this.moddedRotationSpeed = -0.15;
		this.saturation1 = 5;
		this.brightness1 = 80;
		this.saturation2 = 0;
		this.brightness2 = 87;
		this.rotated = false;
		this.rotationSpeed = this.initialRotationSpeed;
	}
	display() {
		this.brightness2 += -0.04;
		this.brightness1 += -0.04;
		this.saturation2 += +0.02;
		this.saturation1 += +0.02;

		//count each seconds since the start of the sketch
		let seconds = int(millis() / 1000 + 1);
		console.log(seconds);
		noStroke();
		if (seconds % 3 === 0) {
			//stroke(24, this.saturation2, this.brightness2);
			fill(21, this.saturation1, this.brightness1);
			this.rotationSpeed = this.moddedRotationSpeed;
			this.rotated = true;
		} else if (seconds % 2 === 0) {
			//stroke(21, this.saturation1, this.brightness1);
			fill(24, this.saturation2, this.brightness2);
			this.rotationSpeed = this.initialRotationSpeed;
			this.rotated = true;
		} else {
			if (!this.rotated) {
				//stroke(24, this.saturation2, this.brightness2);
				fill(21, this.saturation1, this.brightness1);
				this.rotationSpeed = this.moddedRotationSpeed;
			}
		}
		push();
		this.angle = this.angle + this.rotationSpeed;
		translate(this.x, this.y);
		let c = cos(this.angle);
		rotate(this.angle);
		rect(0, 0, this.w, this.w, 100, 100, 100, 100);
		pop();
	}
	move() {
		if (this.w <= 15) {
			this.w = 10;
			this.y = this.y;
		} else {
			this.y += random(-6, 15);
			this.w += random(-1, 1);
		}
	}
}
