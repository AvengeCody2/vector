/*Setup grid variables*/
let o = Object(null);
let g = Object(null);
const mowse = {phi:90, x:0, y:1};

//Time variable
let t = 0;

let ship;

function setup() {
  createCanvas(windowWidth, windowHeight);
  g = new Ortha_Grid(windowWidth, windowHeight, 50);
  h = new Ortha_Grid(width, height, 100);
  //g = new Grid(windowWidth, windowHeight, 50);

  console.log("origin at (" + g.O.x + ", " + g.O.y + ")")
  ship = new Fighter(g.O.x, g.O.y, g.inc);
  //background(30);
  g.displayGrid(false, false);
}

function draw() {
	t = millis();
	let slider = round(t % 6000, 0);
		if (slider > 3000) {
			opac = parseInt(map (slider, 3001, 6000, 100, 255, true));
		} else {
			opac = parseInt(map (slider, 0, 3000, 255, 100, true));
		}
	
    background('black');
    stroke(255, 100, 75, 255);
    strokeWeight(5);
	
	translate(0,0);
	g.displayGrid(true, true, opac, opac, null, null);
	//drawGrid();

	angleMode(DEGREES);
	mouse_track();

	noFill();
	//circle
	strokeWeight(1);
	stroke(50, 200, 255);
	circle(g.O.x, g.O.y, g.inc*2);
	strokeWeight(3);
	stroke(50, 200, 255, opac/2);
	circle(g.O.x, g.O.y, g.inc*2+1);

	push();
	translate(width/2, height/2);
	rotate(mowse.phi);
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


function mouse_track(draw_line = false) {
	let o = {x:g.O.x, y:g.O.y};
	angleMode(DEGREES);
	let phi = atan2(o.y - mouseY, mouseX - o.x);
	let c_p = cos(phi);
	let s_p = sin(phi);
	
	mowse.phi = 90 - phi.toFixed(2);
	mowse.x = c_p.toFixed(2);
	mowse.y = s_p.toFixed(2);
	// console.log("phi = " + mowse.phi);
	// console.log("cos(phi) = " + mowse.x + "\tsin(phi) = " + mowse.y);

	if(draw_line) {
		console.log("x = " + (cos(360-phi)*g.inc) + "\ty = " + (sin(360+phi)* g.inc));
		strokeWeight(3);
		stroke(250, 150, 55);
		line(o.x, o.y, o.x + int(cos(360 - phi) * g.inc), o.y - int(sin(360 + phi) * g.inc));
	}
}

function throttle() {
	let throttle;
	const thrust = createVector(0,0);
	
	let lower_dim = width;
	if (width > height) {
		lower_dim = height;
	} 

	const d = dist(mouseX, mouseY, width/2, height/2);
	console.log("mouse is " + d + " away from x:" + width/2 + "  y:" + height/2);
	if(abs(d) > g.inc && abs(d) < lower_dim/2) { // mouse is between ship and edge of canvas
		console.log(lower_dim/2 + " > " + d + " > " + g.inc);
		throttle = map(d, g.inc, lower_dim/2, 0, 10, true);
	} else if (d < g.inc){
		throttle = 0;
		console.log("d < inc");
		console.log(d + " < " + g.inc);
	} else { //mouse is off canvas
		throttle = 10;
		console.log("d is > lower_dim");
		console.log(d + " > " + lower_dim);
	}
	console.log("throttle: " + throttle);

	thrust.x = parseFloat((throttle * mowse.x * (-1)).toFixed(2));
	thrust.y = parseFloat((throttle * mowse.y).toFixed(2));
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