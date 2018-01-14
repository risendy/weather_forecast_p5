var input, button, greeting;
var ready=false;
var wind;
var position;
var curr_location, curr_country, curr_temp;
var balls=[];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight-200);

  wind = createVector();

  createDiv("Your location:", 20, height+10);

  input = createInput();
  input.position(10, height+30);

  button = createButton('Show');
  button.position(input.x + input.width, height+30);
  button.mousePressed(show);

  noLoop();
}

function show() {
  var location=input.value();
  var url = 'https://api.apixu.com/v1/current.json?key=513d8003c8b348f1a2461629162106&q='+location+'';

  var json = loadJSON(url, gotWeather, errorCallback);
}

function errorCallback(data)
{
  console.log(data);
  ready=false;
  background(255);
  noLoop();

  alert("Error: "+data.statusText);
}

function drawArrow()
{
  // This section draws an arrow pointing in the direction of wind
  push();
  translate(32, height - 32);
  // Rotate by the wind's angle
  rotate(wind.heading() + PI/2);
  noStroke();
  fill(255);
  ellipse(0, 0, 48, 48);

  stroke(45, 123, 182);
  strokeWeight(3);
  line(0, -16, 0, 16);

  noStroke();
  fill(45, 123, 182);
  triangle(0, -18, -6, -10, 6, -10);
  pop();
}

function draw() {
  if (ready)
  {   
    background(200);

    if (curr_location && curr_country && curr_temp && curr_wind)
    {
      stroke(255);
      fill(255);  
      textSize(26);
      text(curr_location+', '+curr_country, 20, 40);
      text(curr_temp+'C', 20, 80);
      text(curr_wind+'MPH', 60, height-25);
    }

    drawArrow();

    stroke(0);
    fill(51);

    for (i=0; i<balls.length; i++)
    {
      balls[i].update();
      balls[i].show();
    }
    
  }

}

function gotWeather(weather) {
  if (weather)
  {
    // Get the angle (convert to radians)
    var angle = radians(Number(weather.current.wind_degree));

    curr_temp=floor(weather.current.temp_c);
    curr_location=weather.location.name;
    curr_country=weather.location.country;
    curr_wind=Number(weather.current.wind_mph);

    // Make a vector
    wind = p5.Vector.fromAngle(angle);

    for (i=0; i<50; i++)
    {
      balls[i]=new Ball();
    }
    
    ready=true;
    loop();
  }
  
}