let pandaImage;
let ship;
let stars1;
let stars2;
let stars3;
let ast1;
let ast2;

function Panda(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
        push();
        translate(this.x + -12, this.y + 15);
        image(pandaImage, -25, -25, 35, 35);
        pop();
    }
}

function Bunny(x, y) {
    this.x = x;
    this.y = y;
    // Draw bunny
    this.draw = function () {
        push();
        translate(this.x + 50, this.y + 10);
        scale(0.5);
        this.drawEar(-20); // Left ear
        this.drawEar(20); // Right ear
        this.drawFace();
        this.drawEye(-10); // Left eye
        this.drawEye(10); // Right eye
        pop();
    }
    this.drawEar = function (x) {
        fill('#fff');
        ellipse(x, -25, 20, 30);
        fill('#ffaabb');
        ellipse(x, -20, 10, 20)
    }
    this.drawEye = function (x) {
        fill('#fff');
        ellipse(x, -8, 10, 10);
        fill('#00c5f2');
        ellipse(x, -8, 5, 5);
    }
    this.drawFace = function () {
        fill('#fff');
        ellipse(0, 0, 60, 60);
        noFill();
        arc(8, 12, 5, 5, HALF_PI, PI);
        arc(3, 12, 5, 5, 0, HALF_PI);
        fill('#ffaabb');
        ellipse(5, 10, 10, 5);
        noFill();
        arc(5, 10, 20, 20, HALF_PI, PI);
    }
}

function SpaceShip(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function () {
        push();
        translate(this.x, this.y);
        noStroke();
        fill('#ffc087');
        triangle(-120, -52, -120, 33, 50, -12);
        triangle(60, -52, 60, 33, 120, -12);
        fill('#fff');
        ellipse(-10, -10, 200, 120);
        fill('#ffc087');
        rect(-112, -44, 21, 69);
        fill('rgba(160,235,235,255)');
        ellipse(50, -10, 50, 70);
        ellipse(-20, -10, 50, 70);
        pop();
    }
}

function Particle() {
    // reference: https://editor.p5js.org/Allayna/sketches/o239lOcns
    this.x = -120;
    this.y = random(-50, 30);
    this.vx = random(-5, -1);
    this.vy = random(-1, 1);
    this.alpha = 255;
    this.d = 6;

    this.finished = function () {
        return this.alpha < 0;
    }

    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 3;
        this.d -= random(0.05, 0.1);
    }

    this.show = function () {
        noStroke();
        fill(random(200, 230), random(50, 150), 10, this.alpha);
        ellipse(this.x, this.y, this.d);
    }
}

function Fire(x, y) {
    this.x = x;
    this.y = y;
    this.particles = [];
    this.draw = function () {
        push();
        translate(this.x, this.y);
        for (let i = 0; i < 10; i++) {
            let p = new Particle();
            this.particles.push(p);
        }
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            this.particles[i].show();
            if (this.particles[i].finished()) {
                this.particles.splice(i, 1);
            }
        }
        fill(40, 25, 2);
        pop();
    }
}

function BunnyShip(x, y) {
    this.x = x;
    this.y = y;

    this.panda = new Panda(this.x, this.y);
    this.bunny = new Bunny(this.x, this.y);
    this.spaceShip = new SpaceShip(this.x, this.y);
    this.fire = new Fire(this.x, this.y);

    this.draw = function () {
        this.update();
        this.spaceShip.draw();
        this.bunny.draw();
        this.panda.draw();
        this.fire.draw();
    }

    this.update = function () {
        this.y = 150 + 30 * sin(frameCount / 12);
        this.x = 200 + 6 * cos(frameCount / 12);
        this.spaceShip.x = this.x;
        this.spaceShip.y = this.y;
        this.bunny.x = this.x;
        this.bunny.y = this.y;
        this.fire.x = this.x;
        this.fire.y = this.y;
        this.panda.x = this.x;
        this.panda.y = this.y;
    }
}

function Star(vx) {
    this.x = random(0, width + 10);
    this.y = random(0, height);
    this.d = random(3, 5);
    this.vx = vx;
    this.update = function () {
        this.x += this.vx;
        if (this.x < -3) {
            this.x = width + 10;
            this.y = random(0, height);
            this.d = random(3, 5);
        }
    }
    this.draw = function () {
        this.update();
        push();
        translate(this.x, this.y);
        fill('#fff');
        ellipse(0, 0, this.d);
        pop();
    }
}

function StarField(vx) {
    this.stars = [];
    this.count = 20;
    for (let i = 0; i < this.count; i++) {
        this.stars.push(new Star(vx));
    }
    this.draw = function () {
        for (let j = 0; j < this.count; j++) {
            this.stars[j].draw();
        }
    }
}

function Asteroid(vx) {
    // Reference: https://editor.p5js.org/simontiger/sketches/r16tcHq3e
    this.x = random(0, width + 10);
    this.y = random(0, height);
    this.r = random(1, 4);

    this.vx = vx;
    this.total = floor(random(5, 15));
    this.offset = [];
    for (let i = 0; i < this.total; i++) {
        this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
    }

    this.update = function () {
        this.x += this.vx;
        if (this.x < -3) {
            this.x = width + 10;
            this.y = random(0, height);
            this.r = random(1, 4);
        }
    }

    this.draw = function () {
        this.update();
        push();
        stroke('#9a9a9a');
        fill('#9a9a9a');
        translate(this.x, this.y);
        beginShape();
        for (let i = 0; i < this.total; i++) {
            let angle = map(i, 0, this.total, 0, TWO_PI);
            let r = this.r + this.offset[i];
            let x = r * cos(angle);
            let y = r * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

}

function AsteroidField(vx) {
    this.asteroids = [];
    this.count = 10;
    for (let i = 0; i < this.count; i++) {
        this.asteroids.push(new Asteroid(vx));
    }
    this.draw = function () {
        for (let j = 0; j < this.count; j++) {
            this.asteroids[j].draw();
        }
    }
}

/**
 * Load image
 */
function preload() {
    pandaImage = loadImage('assets/logo.png');
}

/**
 * Draw function for setup
 */
function setup() {
    var p5jsCanv = createCanvas(600, 300);
    p5jsCanv.parent("p5jsCanvasGoesHere");
    frameRate(30);
    ship = new BunnyShip(200, 150);
    stars1 = new StarField(-0.2);
    stars2 = new StarField(-0.5);
    stars3 = new StarField(-0.55);
    ast1 = new AsteroidField(-1);
    ast2 = new AsteroidField(-1.2);
}

/**
 * Draw function for p5js
 */
function draw() {
    background('#000');
    stroke(0);
    fill(0);

    stars1.draw();
    stars2.draw();
    stars3.draw();
    ast1.draw();
    ast2.draw();
    ship.draw();
}