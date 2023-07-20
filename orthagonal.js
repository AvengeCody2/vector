const COSx = Math.sqrt(3)/2;

class Ortha_Grid{
    #inc;
    #wide;
    #high;
	#cosX;
	#pos;
	#v;
	#corners;

	constructor(max_width, max_height, increment = 48) {
		this.ROWS = new Map();
		this.COLS = new Map();
		
		this.#inc = increment;

        this.wide = null;
		this.high = null;				

        //origin
        this.O = createVector(0, 0);
		
		//velocity
		this.#v = createVector(0, 0);

        //translated by...
        this.#pos = createVector(0,0);

        this.dot_opacity = 255;
		this.dot_weight = 4;
		this.line_opacity = 200;
		this.line_weight = 1;

		this.#cosX = parseInt(COSx * this.#inc);
		this.grid_lines = [];

		this.inc = this.#inc;
		this.#corners = false;
	}
	
	set corners(b){
		if(typeof b === "boolean") {
			this.#corners = b;
			this.makeGridLines(this.#corners);
		}
	}

    get inc() {
        return this.#inc;
    }

	set inc(i) {
		if(this.setIncrement(i)) {
			this.#cosX = parseInt(COSx * this.#inc);
			console.log("One tile is " + this.#cosX + " pixels wide")
			this.calculateCanvas();
			this.mapOrthaGrid();
			this.makeGridLines(this.#corners);
		}
	}
	
	setIncrement(i) {
		if (Number.isInteger(i)) {
			if (i <= 100 && i > 19) {
				if (i%2 != 0) {
					this.#inc = i + 1;
				} else {
					this.#inc = i;
				}
				
				return true;
				console.log("grid increment is set to " + this.#inc);
			} else {
				console.log("OrthaGrid increment must be an integer between 20 and 100. " + i + " is too big.");
				return false;
			}
		} else {
			console.log("OrthaGrid increment must be an integer between 19 and 100. setIncrement() passed argument i = " + i);
			return false;
		}
	}
	
	calculateCanvas(max_width = windowWidth, max_height = windowHeight) {
		let canvasW = 0, canvasH = 0, tiles = 0;
		
		if (max_width >= max_height) {
			//start with the height and shrink the width
			canvasH = max_height - parseInt(max_height%(this.#inc*2));
			tiles = parseInt(canvasH/this.#inc);
			canvasW = tiles * (this.#cosX);
			canvasW = canvasW + (canvasW%2);
		}else {
			//start with the width and shrink the height
			canvasW = max_width - (max_width%(this.#cosX * 2));
			canvasW = canvasW + (canvasW%2);
			tiles = canvasW / (this.#cosX);
			canvasH = parseInt(tiles * this.#inc);
		}
		console.log("Canvas = " + canvasW + " wide X " + canvasH + " high.");
		
		this.#wide = canvasW;
		this.#high = canvasH;
		
		resizeCanvas(canvasW, canvasH);
	}

	dot_opac(o = null) {
		if(Number.isInteger(o)) {
			if(o >= 0 && o <= 255) {this.dot_opacity = o;}
			else if (o < 0) {this.dot_opacity = 0;}
			else {this.dot_opacity = 255;}
			//console.log("dot_opac = " + this.dot_opacity);
		} else if(o != null) {
			console.log("Ortha_grid.dot_opac() called with invalid argument o = " + o +".");
		}
		
		return this.dot_opacity;
	}
	
	dot_thick(s = null) {
		if(Number.isInteger(s)) {
			if(s >= 0 && s <= 50) {this.dot_weight = s;}
			else if (s < 0) {this.dot_weight = 0;}
			else {this.dot_weight = 255;}
			console.log("dot_thick = " + this.dot_weight);
		} else if(s != null) {
			console.log("Ortha_grid.dot_thick() called with invalid argument s = " + s +".");
		}
		
		return this.dot_weight;
	}
	
	line_opac(o = null) {
		if(Number.isInteger(o)) {
			if(o >= 0 && o <= 255) {this.line_opacity = o;}
			else if (o < 0) {this.line_opacity = 0;}
			else {this.line_opacity = 50;}
			//console.log("line_opac = " + this.line_opacity);
		} else if(o != null) {
			console.log("Ortha_grid.line_opac() called with invalid argument o = " + o +".");
		}
		
		return this.line_opacity;
	}
	
	line_thick(s = null) {
		if(Number.isInteger(s)) {
			if(s >= 0 && s <= 15) {this.line_weight = s;}
			else if (s < 0) {this.line_weight = 0;}
			else {this.line_weight = 15;}
			//console.log("line_thick = " + this.line_weight);
		} else if(s != null) {
			console.log("Ortha_grid.line_thick() called with invalid argument s = " + s +".");
		}
		
		return this.line_weight;
	}
	
	get v() {
		return this.#v;
	}
	
	set v(V) {
		if(V instanceof p5.Vector) {
			if(abs(V.x) <= this.inc/2 && abs(V.y) <= this.inc/2) {
				this.#v = V;
			} else {
				TypeError();
			}
		}
	}
	
	
	mapOrthaGrid() {
		this.ROWS.clear();
		this.COLS.clear();
		this.O = createVector(this.#wide/2, this.#high/2)
		
		/*Starting at origin, map x- and y-coordinates 
		to cartesian style coordinates where (o.x, o.y) is (0,0)*/
		
		let Xpos = this.O.x, Ypos = this.O.y;
		let x_co = 0, y_co = 0;
		//starting at origin, move Ypos to bottom of screen
		while(Ypos < this.#high + this.#inc) {
			Ypos += this.#inc/2;
			y_co--;
		}
		console.log("y_co = " + y_co);
		//Map y-ccordinates in form {y_co:Ypos}
		while(Ypos >= this.#inc/-1) {
			this.ROWS.set(y_co, Ypos);
			y_co++;
			Ypos -= this.#inc/2;
		}
	
		//starting at origin, move Xpos to left end of screen
		while(Xpos > (this.#cosX * -1)) {
			Xpos -= this.#cosX;
			x_co--;
		}
		let end = x_co * -1
		//Map x-ccordinates in form {x_co:Xpos}
		while(Xpos <= this.#wide + this.#cosX) {
			this.COLS.set(x_co, Xpos);
			x_co++;
			Xpos += this.#cosX;
		}
		
		let s = this.COLS.size + " COLS\n"
		s += this.ROWS.size + " ROWS\n"
		console.log(s);		
			
		console.log("in mapOrthaGrid()...")
		//print ROWS map to console
		console.log("ROWS has " + this.ROWS.size + " keys.")
		console.log("----y_co: Ypos----");
		for(const [k,v] of this.ROWS.entries()) {
			console.log(k + ": " + v);
		}
		//print COLS map to console
		console.log("COLS has " + this.COLS.size + " keys.")
		console.log("----x_co: Xpos----");
		for(const [k,v] of this.COLS.entries()) {
			console.log(k + ": " + v);
		}
	}
	
		
	displayGrid(draw_lines = true, draw_points = true, dot_opacity = null, line_opacity = null, dot_size = null, line_size = null) {
		this.moveGrid();

		if	(dot_opacity) {
			this.dot_opac(dot_opacity);
		}
		if (dot_size) {
			this.dot_thick(dot_size);
		}
		
		if (draw_points) {
			this.drawGridPoints(this.dot_opac());
		}
		
		if (line_opacity) {
			this.line_opac(line_opacity);
		}
		if (line_size) {
			this.line_thick(line_size);
		}
		
		if (draw_lines) {
			this.drawGridLines();
		}
	}
	
	
	//draw the vertices of the orthagonal grid
	drawGridPoints() {
		strokeWeight(this.dot_thick());	
		noFill();

        push();
        translate(this.#pos.x, this.#pos.y);
		//Iterate through ROWS and COLS to create points
		for(const [yk, yv] of this.ROWS.entries()) {
			for(const [xk, xv] of this.COLS.entries()) {
				stroke(250, 255, 255, this.dot_opac() - (4 * abs(xk))-(8 * abs(yk)));
				if (yk%2 == 0 && xk%2 == 0) {
					point(xv, yv);
				} else if(yk%2 != 0 && xk%2 != 0) {
					point(xv, yv);
				}
			}
		}
		pop();
	}
	
	//create vector library of orthagonal lines to be called in drawGridLines()
	makeGridLines(corners_enabled = false) {	
		this.grid_lines = [];
		//Use cartesian grid to align vertices
		const x_max = (this.COLS.size-1)/2;
		const y_max = (this.ROWS.size-1)/2;
		const y_min = y_max * -1;
		
		const p1 = createVector(0, 0);
		const p2 = createVector(0, 0);
		
		for(let b = y_min; b <= y_max; b+=2) {
			p1.y = b;
			if (y_max >= x_max + b) {
				p2.x = x_max;
				p2.y = x_max + b;
			}else {
				p2.y = y_max;
				p2.x = y_max - b;
			}

			this.grid_lines.push({
				P1:createVector(this.COLS.get(p1.x), this.ROWS.get(p1.y)),
				P2:createVector(this.COLS.get(p2.x) + (this.#cosX), this.ROWS.get(p2.y) - (this.#inc/2))
			})
		}
		

		if(corners_enabled) {
			// fill in the corners
			for(p1.x = 2; p1.x < x_max; p1.x += 2) {
				p1.y = y_min;
				p2.x = x_max;
				
				//y = x-x1+y1
				p2.y = p2.x - p1.x + p1.y;
				
				this.grid_lines.unshift({
					P1:createVector(this.COLS.get(p1.x), this.ROWS.get(p1.y)),
					P2:createVector(this.COLS.get(p2.x) + (this.#cosX), this.ROWS.get(p2.y) - (this.#inc/2))
				})
			}
		}

		//test it out
		console.log("grid_lines contains " + this.grid_lines.length + " lines.");
		for(let i = 0; i < this.grid_lines.length; i++) {
			console.log("["+i+"]\tP1: " + this.grid_lines[i].P1 + "\n\tP2: " + this.grid_lines[i].P2)
		}
	}

	moveGrid() {
		if(abs(this.#pos.y) < abs(this.#inc)) {
			this.#pos.y += this.#v.y;
		} else {
			this.#pos.y = 0;
		}

        if(abs(this.#pos.x) < abs(this.#cosX*2)) {
            this.#pos.x += this.#v.x;
        } else {
            this.#pos.x = 0;
        }
	}

	drawGridLines() {
		noFill();
		let opacity = this.line_opac();
		strokeWeight(this.line_thick());
		
		//draw vertical grid lines
		push();
		translate(this.#pos.x, 0);
		for(const [k,c] of this.COLS.entries()) {
			stroke(50,255,17,opacity - (8 * abs(k)));
			line(c, 0, c, this.#high);
		}
		pop();

		//draw orthagonal lines stored in array
		push();
		translate(this.#pos.x, this.#pos.y);
		for(const l of this.grid_lines) {
			//Opacity decreases as lines move away from center
			stroke(50,255,17,opacity - (16 * (abs(l.P1.y - (this.#high/2)))/this.#inc));
			//This draws all the lines, but now how to move them by #pos.x/y
			line(l.P1.x, l.P1.y, l.P2.x, l.P2.y);
			line(l.P1.x, height - l.P1.y, l.P2.x, height - l.P2.y);
			line(width - l.P1.x, l.P1.y, width - l.P2.x, l.P2.y);
			line(width - l.P1.x, height - l.P1.y, width - l.P2.x, height - l.P2.y);
		}
		pop();
	}

	/*
			//Code for drawing thick hex around border
			stroke(50,255,17,opacity - (4 * abs(p1.y)));
			if(p1.y == y_min) {
				strokeWeight(this.line_thick()+4);
				//these lines stay static
				v.x = 0, v.y = 0;
			} else {
				strokeWeight(this.line_thick());
				//add in motion
				v.x = this.#pos.x, v.y = this.#pos.y;
			}			
			

	*/
}



/*
function drawOrthaGrid_local() {
	let x = o.x;
	let y = o.y;
	
	noStroke();
	noFill();
	//draw a series of grid points in a hexagon
	//starting with the origin
	let n = createVector(x,y);
	//moving to the 12 o-clock position
	let p = createVector(x, y-inc);
	//rotating clockwise
	let q = createVector(x+(sqrt(3)/2*inc), y-(inc/2));
	let r = createVector(x+(sqrt(3)/2*inc), y+(inc/2));
	let s = createVector(x, y+inc);
	let t = createVector(x-(sqrt(3)/2*inc), y+(inc/2));
	let u = createVector(x-(sqrt(3)/2*inc), y-(inc/2));
	
	strokeWeight(1);
	stroke(0, 225, 10, 200);
	beginShape(TRIANGLE_FAN);
	vertex(o.x, o.y);
	vertex(p.x, p.y);
	vertex(q.x, q.y);
	vertex(r.x, r.y);
	vertex(s.x, s.y);
	vertex(t.x, t.y);
	vertex(u.x, u.y);
	vertex(p.x, p.y);
	endShape();
	
	strokeWeight(3);
	stroke(255, 0, 0,200);
	beginShape(POINTS);
	vertex(o.x, o.y);
	vertex(p.x, p.y);
	vertex(q.x, q.y);
	vertex(r.x, r.y);
	vertex(s.x, s.y);
	vertex(t.x, t.y);
	vertex(u.x, u.y);
	endShape();
}
*/