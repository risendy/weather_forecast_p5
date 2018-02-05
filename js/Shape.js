function Shape(temp, angle)
{
	this.ballVector=createVector(random(width), random(height));
	this.size=random(8, 26);
	this.temp=temp;
	this.angle = angle;

	this.wind = p5.Vector.fromAngle(angle);

	this.wind.x = this.wind.x*random(1,1.5);
	this.wind.y = this.wind.y*random(1,1.5);

	this.color=function()
	{
		if (this.temp<0)
		{
			stroke(132, 146, 220);
			fill(132, 146, 220);
		}
		else if (this.temp>=0 && this.temp<10)
		{
			stroke(154, 190, 190);
			fill(154, 190, 190);
		}
		else if (this.temp>10 && this.temp<20)
		{
			stroke(139, 235, 134);
			fill(139, 235, 134);
		}
		else if (this.temp>20)
		{
			stroke(251, 182, 122);
			fill(251, 182, 122);
		}
	}

	this.update=function()
	{
		if (this.ballVector.x > width)
		{
			this.ballVector.x=0;
		}

		if (this.ballVector.x < 0)
		{
			this.ballVector.x=width;
		}

		if (this.ballVector.y > height)
		{
			this.ballVector.y=0;
		}

		if (this.ballVector.y < 0)
		{
			this.ballVector.y=height;
		}
	}

	this.newStar=function(x, y, radius1, radius2, npoints)
	{
		var angle = TWO_PI / npoints;
		var halfAngle = angle/2.0;
		beginShape();
		for (var a = 0; a < TWO_PI; a += angle) {
		  var sx = x + cos(a) * radius2;
		  var sy = y + sin(a) * radius2;
		  vertex(sx, sy);
		  sx = x + cos(a+halfAngle) * radius1;
		  sy = y + sin(a+halfAngle) * radius1;
		  vertex(sx, sy);
		}
		endShape(CLOSE);
	}

	this.drawShape=function()
	{
		if (this.temp<0)
		{
			  push();
			  	this.newStar(this.ballVector.x, this.ballVector.y, 5, this.size, 5); 
			  pop();
		}
		else
		{
			ellipse(this.ballVector.x, this.ballVector.y, this.size, this.size);
		}
	}

	this.show=function()
	{
		this.color();
		this.drawShape();

		this.ballVector.add(this.wind);
	}
}