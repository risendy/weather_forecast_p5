var input, button, greeting;
var ready=false;
var wind;
var position;
var curr_location, curr_country, curr_temp, angle, conditionIcon, conditionText, imageIconObject;
var balls=[];
var callMethod = false;
var cities=[];
var forecast=[];

function setup() {
  createCanvas(window.innerWidth/2, window.innerHeight/2);

  initAutocomplete();

  wind = createVector();

  input = $('#locationInput');
  button = $('#showButton');

  button.click(function(event) {
    loadCurrentWeather();
  });

  noLoop();
}

function initAutocomplete()
{
   $("#locationInput").autocomplete({
     source :function( request, response ) {
       $.ajax({
        url: "https://api.apixu.com/v1/search.json?key=513d8003c8b348f1a2461629162106",
        dataType: "json",
        data: {
         q: request.term
       },
       success: function( data ) {
         if(!data.length){

           var result = [
           {
            label: 'No matches found', 
            value: response.term
          }
          ];

          response(result);
        }
        else {
         response($.map(data, function(item) {

          if (item.name.match('/,/'))
          {
            var valueArr=item.name.split(",");
            var valueStr=valueArr[0];
          }
          else
          {
            var valueStr=false;
          }

           return {
             label : item.name,
             value : valueStr
           };
         }));
       }

     }
   });
     },
     select: function (event, ui) {
      $("#locationInput").val(ui.item.label);
      $("#locationInput").attr("data-search", ui.item.value);
      return false;
    }
  });
}

function clearHtml()
{
  $('#locationInput').val("");
  $('#locationInput').attr("data-search", "");
}

function loadCurrentWeather() {
  var location=input.attr("data-search");

  if (location)
  {
    var url = 'http://api.apixu.com/v1/current.json?key=513d8003c8b348f1a2461629162106&q='+location+'';
    var json = loadJSON(url, gotCurrentWeather, errorCallback);

    clearHtml();
  }
  else
  {
    alert("Please select an option from the list");
  }
  
}

function loadForecast() {
    var url = 'http://api.apixu.com/v1/forecast.json?key=513d8003c8b348f1a2461629162106&q='+location+'&days=4';
    var json = loadJSON(url, gotWeatherForecast, errorCallback2);
}

function errorCallback(data)
{
  console.log(data);
  ready=false;
  background(255);
  noLoop();

  alert("Error1: "+data.statusText);
}

function errorCallback2(data)
{
  console.log(data);
  ready=false;
  background(255);
  noLoop();

  alert("Error2: "+data.statusText);
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

function drawInformation()
{
  rectMode(CORNER);
  noStroke();

  var firstLine=curr_temp+'°, '+curr_location+', '+curr_country;
  var textWidthSize=textWidth(firstLine);
  var colorRect=color(100,100,100);
  
  colorRect.setAlpha(180);
  
  fill(colorRect);
  rect(0, 0, textWidthSize+200, 120, 0, 20, 20, 0);

  fill(255);
  textSize(26);
  text(firstLine, 20, 40);
  text(conditionText, 80, 85);

  image(imageIconObject, 12, 45, 64, 64);

  fill(colorRect);
  rect(0,height-65, 200, 80, 0, 20, 20);
  fill(255);
  text(curr_wind+'MPH', 70, height-25);

  if (forecast.length>0)
  {
    fill(colorRect);
    rect(width/2+20, height-65, 350, 80, 20, 20, 20, 20);
    fill(255);
    textSize(16);
    text(forecast[1].date, 380, height-40);
    text(forecast[1].avg_temp+"°", 380, height-20);

    text(forecast[2].date, 480, height-40);
    text(forecast[2].avg_temp+"°", 480, height-20);

    text(forecast[3].date, 580, height-40);
    text(forecast[3].avg_temp+"°", 580, height-20);

    stroke(60);
    line(width/2+130, height-65, width/2+130, height);
    line(width/2+230, height-65, width/2+230, height);
  }
 
}

function draw() {
  if (ready)
  {   
    background(200);

    stroke(0);
    fill(51);

    for (i=0; i<balls.length; i++)
    {
      balls[i].update();
      balls[i].show();
    }

    drawInformation();
    drawArrow();
  }

}

function gotCurrentWeather(weather) {
  if (weather)
  {
    callMethod=true;

    // Get the angle (convert to radians)
    angle = radians(Number(weather.current.wind_degree));
    conditionIcon = "http://"+weather.current.condition.icon;
    conditionText = weather.current.condition.text;

    curr_temp=floor(weather.current.temp_c);
    curr_location=weather.location.name;
    curr_country=weather.location.country;
    curr_wind=Number(weather.current.wind_mph);

    imageIconObject = createImg(conditionIcon);
    imageIconObject.hide();

    // Make a vector
    wind = p5.Vector.fromAngle(angle);

    for (i=0; i<50; i++)
    {
      balls[i]=new Ball();
    }

    loadForecast();
  }
  
}

function gotWeatherForecast(weather) {
  if (weather)
  {
    for (j=0; j<weather.forecast.forecastday.length; j++)
    {
      forecast[j]={date: weather.forecast.forecastday[j].date, avg_temp:weather.forecast.forecastday[j].day.avgtemp_c};
    }

    ready=true;
    loop();
  }
  
}