function Ball()
{
	this.ballVector=createVector(random(width), random(height));
	
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
		ellipse(this.ballVector.x, this.ballVector.y, 16, 16);
		this.ballVector.add(wind);
	}
}