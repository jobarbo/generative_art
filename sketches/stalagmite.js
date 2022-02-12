export default class Stalagmite {
	constructor(x, y, w, yDir, stalagHue, stalagSat, stalagBright) {
		//this.palettes = random(palettes);
		this.x = x;
		this.y = y;
		this.w = w;
		this.yDir = yDir;
		this.angle = 0.0;
		this.rotationModList = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
		this.strokeColor = color(0, 10, 20, 85);
		this.stalagHue = stalagHue;
		this.stalagSat = stalagSat;
		this.stalagBright = stalagBright;
		this.stalagRadius = 0;
		this.initialRotationSpeed = random(0, 1);
		this.moddedRotationSpeed = random(this.rotationModList);
		this.rotationSpeed = this.initialRotationSpeed;
	}
	display() {
		if (second() % 2 === 0) {
			//this.ranColor = color(this.palettes[int(random(1, 5))]);
			stroke(this.strokeColor);
			fill(this.stalagHue, this.stalagSat, this.stalagBright);
			this.rotationSpeed = this.moddedRotationSpeed;
		} else {
			stroke(this.strokeColor);
			fill(this.stalagHue, this.stalagSat, this.stalagBright);
			this.rotationSpeed = this.initialRotationSpeed;
		}
		push();
		this.angle = this.angle + this.rotationSpeed;
		translate(this.x, this.y);
		rotate(this.angle);
		if (this.stalagRadius <= 0) {
			this.stalagRadius = 0;
		}
		this.stalagRadius += random(-1, 1.2);
		rect(0, 0, this.w, this.w, this.stalagRadius);
		pop();
	}
	move() {
		if (this.w <= 15) {
			this.w = 0;
			this.y = this.y;
		} else {
			this.y += random(6 * this.yDir, 0);
			this.w += random(-10, 8.8);
		}
	}
}
