class Bob {
    constructor(painter, mass, pivot, theta, radius) {
        this.painter = painter;
        this.mass = mass;
        this.pivot = pivot;
        this.theta = theta; // set theta and radius, move to correct x/y coordinates, then recalculate theta to be in correct domain
        this.radius = radius;
        this.time = 0;
        this.g = 9.8;
        this.move_to_arc();
        this.timestep = 10;
        this.theta = calculate_theta(this.x, this.y, this.pivot.x, this.pivot.y);
        this.thetaMax = this.theta;
        let self = this;

        this.clock = setInterval(function () {
            self.time += self.timestep;               
            self.calculate_xy(self.thetaMax, self.radius, self.g, self.time);
            self.move_to_arc();
            self.painter.paint(); // draw all objects onto the canvas
        }, this.timestep);
    }

    draw(ctx) {
        ctx.fillStyle = "black";
        ctx.fillText(this.theta, 100, 100);
        ctx.strokeStyle = "black";
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.pivot.x, this.pivot.y);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
        ctx.fill();
    }

    move_to_arc() {
        // move to correct coordinates from polar coordinates
        this.x = this.pivot.x + Math.sin(this.theta) * this.radius;
        this.painter.paint();
        this.y = this.pivot.y + Math.cos(this.theta) * this.radius;
        this.painter.paint();
    }
    calculate_xy(thetaMax, radius, g, t){
        let T = 2*Math.PI*Math.sqrt(radius/g);                   //Period
        t = t / 100;                                             //Slow it down
        this.theta = thetaMax*Math.cos(2*Math.PI*t/T);           //Calculate new theta based on time differential
        this.x = this.pivot.x + radius * Math.cos(this.theta);   //Update x and y
        this.y = this.pivot.y + radius * Math.sin(this.theta);
    }
}

function calculate_theta(x, y, pivot_x, pivot_y) {
    let diff_x = x - pivot_x;
    let diff_y = y - pivot_y;
    let theta = Math.atan(diff_x / diff_y);

    if (diff_x < 0 && diff_y < 0) { theta = (Math.PI) + theta; } // adjust for quadrant I
    if (diff_x > 0 && diff_y < 0) { theta = theta - Math.PI; } // adjust for quadrant II

    if (diff_y === 0 && diff_x < 0) { theta = 3 * Math.PI / 2; } // adjust for axes
    if (diff_y === 0 && diff_x > 0) { theta = Math.PI / 2; }
    if (diff_x === 0 && diff_y < 0) { theta = Math.PI; }
    if (diff_x === 0 && diff_y > 0) { theta = 0; }

    if (theta < 0) { theta += Math.PI * 2; }
    if (theta > Math.PI * 2) { theta -= Math.PI * 2; }

    if (theta > Math.PI) { // convert angles greater than pi to negative angles
        theta -= Math.PI * 2;
    }

    return theta;
}
