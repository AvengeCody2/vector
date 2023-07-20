class Fighter {
	constructor(x = 0, y = 0, radius = 50) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.scale = this.set_scale();
	}
	
	set_location(x, y) {
		this.x = x
		this.y = y
	}
	
	set_radius(r) {
		if (Number.isSafeInteger(r) && r != this.radius){
			this.radius = r
			this.scale = this.set_scale();
		}
		return this.radius
	}
	
	set_scale() {
		return Number.parseFloat(map(1, 0, 50, 0, this.radius, true));
	}
	
	display(x = this.x, y = this.y, r = this.radius) {
		this.set_radius(r);
		const s = this.scale;
		noStroke();

		//left tail wing
		fill(255, 110, 100, 185);
		beginShape();
		vertex(x - (3*s), y - (2*s));
		vertex(x - (12*s), y + (10*s));
		vertex(x - (14*s), y + (32*s));
		vertex(x - (11*s), y + (39*s));
		vertex(x - (3*s), y + (14*s));
		endShape(CLOSE);
		
		//right tail wing
		beginShape();
		vertex(x + (3*s), y - (2*s));
		vertex(x + (12*s), y + (10*s));
		vertex(x + (14*s), y + (32*s));
		vertex(x + (11*s), y + (39*s));
		vertex(x + (3*s), y + (14*s));
		endShape(CLOSE);

		//left top wing
		beginShape();
		vertex(x - (6*s), y - (10*s));
		vertex(x - (22*s), y - (13*s));
		vertex(x - (57*s), y - (11*s));
		vertex(x - (31*s), y - (4*s));
		vertex(x - (15*s), y - (4*s));
		vertex(x - (4*s), y -  (7*s));
		endShape(CLOSE);

		//left bottom wing
		beginShape();
		vertex(x - (3*s), y - (7*s));
		vertex(x - (20*s), y - (5*s));
		vertex(x - (50*s), y + (5*s));
		vertex(x - (47*s), y + (6*s));
		vertex(x - (22*s), y + (5*s));
		vertex(x - (2*s), y - (5*s));
		endShape(CLOSE);

		//right top wing
		beginShape();
		vertex(x + (6*s), y - (10*s));
		vertex(x + (22*s), y - (13*s));
		vertex(x + (57*s), y - (11*s));
		vertex(x + (31*s), y - (4*s));
		vertex(x + (15*s), y - (4*s));
		vertex(x + (4*s), y -  (7*s));
		endShape(CLOSE);

		//right bottom wing
		beginShape();
		vertex(x + (3*s), y - (7*s));
		vertex(x + (20*s), y - (5*s));
		vertex(x + (50*s), y + (5*s));
		vertex(x + (47*s), y + (6*s));
		vertex(x + (22*s), y + (5*s));
		vertex(x + (2*s), y - (5*s));
		endShape(CLOSE);
		
		
		//nose
		fill(120, 0, 0, 225); // set opac to full
		quad(x, y + (4*s), 
			x - (5*s), y - (6*s), 
			x, y - (36*s), 
			x + (5*s), y - (6*s));

		//cockpit
		fill(0, 0, 0, 200);
		quad(x, y - (12*s), 
			x + (3*s), y - (10*s), 
			x, y - (2*s), 
			x - (3*s), y - (10*s));
	  }

}