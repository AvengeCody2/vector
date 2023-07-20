class Cockpit {
  constructor(radius = 32, pos_x = width/2, pos_y = height/2, red = 50, green = 0, blue = 150, opacity = 170) {
    this.r = red;
    this.g = green;
    this.b = blue;
    this.o = opacity;
    this.color = color(this.r, this.g, this.b, this.o);
    
    if (pos_x < 0 || pos_x >= width) {
      pos_x = width / 2;
    }

    if (pos_y < 0 || pos_y >= height) {
      pos_y = height / 2;
    }

    this.x = pos_x;
    this.y = pos_y;

    if (radius > height / 4 || radius < 1) {
      radius = 32;
    }
    this.rad = radius;
    this.on = false;
  }
  
  set_location(x, y) {
  	this.x = x
  	this.y = y
  }
  
  set_radius(r) {
  	this.rad = r
  }

  // Accepts an x and y coordinate. 
  // Compares the distance between the circles center and the point specified and returns a boolean
  contains(xb, yb) {
    let d = dist(this.x, this.y, xb, yb);
    return (d < this.rad);
  }

  display() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.rad * 2);
  }

  bounce_on_edge() {
    if (this.x > width - this.rad || this.x < this.rad) {
      this.v_x *= -1;
    }
    if (this.y > height - this.rad || this.y < this.rad) {
      this.v_y *= -1;
    }
  }

  move() {
    this.x += this.v_x;
    this.y += this.v_y;
  }

  clicked() {
    if (this.contains(mouseX, mouseY)) {
      this.on = !this.on;
      this.v_x *= random(-0.5, -1);
    }
  }
}
