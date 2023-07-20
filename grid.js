class Grid {
    #inc;
	#pos;
	#v;

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
		
		this.inc = this.#inc;
    }
	
    get inc() {
        return this.#inc;
    }

	set inc(i) {
		if(this.setIncrement(i)) {
			this.calculateCanvas();
			this.mapGrid();
		}			
	}
	
	setIncrement(i) {
		if (Number.isInteger(i)) {
			if (i < 100 && i > 19) {
				if (i%2 != 0) {
					this.#inc = i + 1;
				} else {
					this.#inc = i;
				}
				
				return true;
				console.log("grid increment is set to " + this.#inc);
			} else {
				console.log("OrthaGrid increment must be an integer between 19 and 100. " + i + " is too big.");
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
			canvasW = canvasH;
		}else {
			//start with the width and shrink the height
			canvasW = max_width - parseInt(max_width%(this.#inc * 2));
			canvasH = canvasW;
		}
		console.log("Canvas = " + canvasW + " wide X " + canvasH + " high.");
		
		this.wide = canvasW;
		this.high = canvasH;
		
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
			}
		}
	}

	
	mapGrid() {
		this.ROWS.clear();
		this.COLS.clear();
		this.O.x = this.wide/2;
		this.O.y = this.high/2;
		
		/*Starting at origin, map x- and y-coordinates 
		to cartesian style coordinates where (o.x, o.y) is (0,0)*/
		
		let Xpos = this.O.x, Ypos = this.O.y;
		let x_co = 0, y_co = 0;
		//starting at origin, move Ypos to bottom of screen
		while(Ypos < this.high) {
			Ypos += this.#inc;
			y_co--;
		}
		console.log("y_co = " + y_co);
		//Map y-ccordinates in form {y_co:Ypos}
		while(Ypos >= 0) {
			this.ROWS.set(y_co, Ypos);
			y_co++;
			Ypos -= this.#inc;
		}
	
		//starting at origin, move Xpos to left end of screen
		while(Xpos > 0) {
			Xpos -= this.#inc;
			x_co--;
		}
		let end = x_co * -1
		//Map x-ccordinates in form {x_co:Xpos}
		while(Xpos <= this.wide) {
			this.COLS.set(x_co, Xpos);
			x_co++;
			Xpos += this.#inc;
		}
		
		let s = this.COLS.size + " COLS\n"
		s += this.ROWS.size + " ROWS\n"
		console.log(s);		
			
		console.log("in mapGrid()...")
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
				point(xv, yv);
			}
		}
        pop();
	}
	
	//draw an orthagonal grid using the ROWS and COLS arrays
	//moving with a velocity of v
	drawGridLines() {
		noFill();
		let opacity = this.line_opac();
        strokeWeight(this.line_thick());
		
        push();
        translate(this.#pos.x, 0);
		//draw vertical grid lines
		for(const [k,c] of this.COLS.entries()) {
			stroke(50,255,17,opacity - (8 * abs(k)));
			line(c, 0, c, this.high);
		}
        pop();

        push();
        translate(0, this.#pos.y);
        //draw horizontal grid lines
        for(const [k, r] of this.ROWS.entries()) {
			stroke(50,255,17,opacity - (8 * abs(k)));
			line(0, r, this.wide, r);
        }
        pop();
	}
	
	moveGrid() {
		if(abs(this.#pos.y) < abs(this.#inc)) {
			this.#pos.y += this.#v.y;
		} else {
			this.#pos.y = 0;
		}

        if(abs(this.#pos.x) < abs(this.#inc)) {
            this.#pos.x += this.#v.x;
        } else {
            this.#pos.x = 0;
        }

        //translate(this.#pos.x, this.#pos.y);
	}
}