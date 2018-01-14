function Ball()
{
	this.ballVector=createVector(random(width), random(height));
	this.size=random(8, 26);

	this.color=function()
	{
		fill(random(255));
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
		stroke(0);
		fill(1, 1, 136);
		ellipse(this.ballVector.x, this.ballVector.y, this.size, this.size);
		this.ballVector.add(wind);
	}
}