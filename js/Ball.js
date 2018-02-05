function Ball($temp)
{
	this.ballVector=createVector(random(width), random(height));
	this.size=random(8, 26);
	this.temp=$temp;

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

	this.show=function()
	{
		this.color();
		ellipse(this.ballVector.x, this.ballVector.y, this.size, this.size);
		this.ballVector.add(wind);
	}
}