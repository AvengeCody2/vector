/*Setup grid variables*/
let o = Object(null);
let g = Object(null);
let mouse = Object(null);
let d;
let theta;

//Time variable
let t = 0;

let ship;

function setup() {
  createCanvas(windowWidth, windowHeight);
  g = new Ortha_Grid(windowWidth, windowHeight, 50);
  console.log("origin at (" + g.O.x + ", " + g.O.y + ")")
  ship = new Fighter();
}

function draw() {
	t = millis();
	let slider = round(t % 6000, 0);
		if (slider > 3000) {
			opac = parseInt(map (slider, 3001, 6000, 100, 255, true));
		} else {
			opac = parseInt(map (slider, 0, 3000, 255, 100, true));
		}
	
	mouse = createVector(mouseX, mouseY);

    background('black');
	g.dot_opacity = opac;
	g.line_opacity = opac;
	g.displayGrid(true, true);
	//drawGrid();

	d = p5.Vector.sub(mouse, g.O);
	angleMode(DEGREES);
	theta = d.heading();
	console.log("theta = " + theta.toFixed(2));

	noFill();
	//circle
	strokeWeight(1);
	stroke(50, 200, 255);
	circle(g.O.x, g.O.y, g.inc*2);
	strokeWeight(3);
	stroke(50, 200, 255, opac/2);
	circle(g.O.x, g.O.y, g.inc*2+1);

	push();
	translate(g.O.x, g.O.y);
	rotate(theta + 90);
	ship.display(0, 0, g.inc);
	pop();

	/*
	//orbiting point
	strokeWeight(5);
	stroke(opac/2, 200, 255, 150);
	
	let phi = map(slider, 0, 6000, 0, 360, true);
	let pX = g.O.x + (g.inc * cos(phi));
	let pY = g.O.y + (g.inc * sin(phi));
	point(pX, pY);
	*/
	throttle();
}

function keyPressed() {
	let i = g.inc;
	if (keyCode === UP_ARROW) {
		i += 2;
		g.inc = i;
	}else if (keyCode === DOWN_ARROW) {
		i -= 2;
		g.inc = i;
	}	
}


function throttle() {
	let throttle;
	const thrust = createVector(0,0);
	
	let lower_dim = width;
	if (width > height) {
		lower_dim = height;
	} 

	// console.log("mouse is " + d.mag() + " away from x:" + width/2 + "  y:" + height/2);
	if(abs(d.mag()) > g.inc && abs(d.mag()) < lower_dim/2) { // mouse is between ship and edge of canvas
		// console.log(lower_dim/2 + " > " + d.mag() + " > " + g.inc);
		throttle = map(d.mag(), g.inc, lower_dim/2, 0, 10, true);
	} else if (d.mag() < g.inc){
		throttle = 0;
		// console.log("d.mag() < inc");
		// console.log(d.mag() + " < " + g.inc);
	} else { //mouse is off canvas
		throttle = 10;
		// console.log("d.mag() is > lower_dim");
		// console.log(d.mag() + " > " + lower_dim);
	}
	console.log("throttle: " + throttle);

	thrust.x = parseFloat((throttle * cos(theta) * (-1)).toFixed(2));
	thrust.y = parseFloat((throttle * sin(theta) * (-1)).toFixed(2));
	console.log("thrust.x = " + thrust.x + "\nthrust.y = " + thrust.y);

	g.v.set(thrust)
}

//draws a tiny grid
function drawGrid() {
  var x = width/2;
  var y = height/2;
  //set line colors and width
  stroke(240, 180);
  strokeWeight(1);
  //draw x and y major axes
  line(x, 0, x, height);
  line(0, y, width, y);

  //draw tick marks
  stroke(0, 175, 0, 170);
  for (let i = y-50; i <= y + 60; i += 5) {
    if(i != y){
      line(x - 100, i, x + 100, i);
    }
  }

  for (let i = x-100; i <= x + 100; i += 5) {
    if(i != x){
      line (i, y - 50, i, y + 60);
    }
  }
}