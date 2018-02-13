var input, button, greeting;
var ready=false;
var wind;
var position;
var curr_location, curr_country, curr_temp, angle, conditionIcon, conditionText, imageIconObject;
var balls=[];
var callMethod = false;
var cities=[];
var forecast=[];
var imageIconObject2, imageIconObject3, imageIconObject4, imageIconObject5;

function setup() {
  noLoop();
  createCanvas(window.innerWidth, window.innerHeight/2);

  initAutocomplete();

  wind = createVector();

  input = $('#locationInput');
  button = $('#showButton');

  button.click(function(event) {
    $.LoadingOverlay("show");

    $.when(loadCurrentWeather(), loadForecast()).then(function (resp1, resp2) {
      clearHtml();

      ready=true;

      $.LoadingOverlay("hide");
    })

});

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
    },
  });
}

function loadCurrentWeather() {
  var location=input.attr("data-search");

  if (location)
  {
    var url = 'http://api.apixu.com/v1/current.json?key=513d8003c8b348f1a2461629162106&q='+location+'';
    var json = loadJSON(url, gotCurrentWeather, errorCallback);
  }
  else
  {
    alert("Please select an option from the list");
  }
  
}

function loadForecast() {
    var location=input.attr("data-search");

    if (location)
    {
      var urlForecast = 'http://api.apixu.com/v1/forecast.json?key=513d8003c8b348f1a2461629162106&q='+location+'&days=5';
      var jsonForecast = loadJSON(urlForecast, gotWeatherForecast, errorCallback2);
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

    for (i=0; i<50; i++)
    {
      balls[i]=new Shape(curr_temp, angle);
    }

    loop();
  }
  
}

function gotWeatherForecast(weather) {
  if (weather)
  {
    for (j=0; j<weather.forecast.forecastday.length; j++)
    {
      forecast[j]={date: weather.forecast.forecastday[j].date, avg_temp:weather.forecast.forecastday[j].day.avgtemp_c, iconUrl:"http://"+weather.forecast.forecastday[j].day.condition.icon};
    }

    imageIconObject2 = createImg(forecast[1].iconUrl);
    imageIconObject2.hide();

    imageIconObject3 = createImg(forecast[2].iconUrl);
    imageIconObject3.hide();

    imageIconObject4 = createImg(forecast[3].iconUrl);
    imageIconObject4.hide();

    imageIconObject5 = createImg(forecast[4].iconUrl);
    imageIconObject5.hide();
  }
  
}

function drawArrow()
{
  var wind = p5.Vector.fromAngle(angle);

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
    rect(width-420, height-65, width, 80, 20, 20, 20, 20);
    fill(255);
    textSize(16);

    textStyle(BOLD);
    text(forecast[1].date, width-380, height-40);
    text(forecast[2].date, width-250, height-40);
    text(forecast[3].date, width-120, height-40);
    //text(forecast[4].date, width/1.5+355, height-40);

    textStyle(NORMAL);

    text(forecast[1].avg_temp+"°", width-380, height-20);

    image(imageIconObject2, width-330, height-35, 32, 32);
    
    text(forecast[2].avg_temp+"°", width-250, height-20);

    image(imageIconObject3, width-200, height-35, 32, 32);

    text(forecast[3].avg_temp+"°", width-120, height-20);

    image(imageIconObject4, width-70, height-35, 32, 32);
 
    stroke(60);
    line(width-275, height-65, width-275, height);
    line(width-145, height-65, width-145, height);
  }
 
}

function setBackgroundByTemp()
{
  if (curr_temp<0)
  {
    background(40, 66, 206);
  }
  else if (curr_temp>=0 && curr_temp < 10)
  {
    background(57, 130, 130);
  }
  else if (curr_temp>=10 && curr_temp<20)
  {
    background(72, 166, 88);
  }
  else if (curr_temp>=20)
  {
    background(222, 134, 58);
  }
}

function errorCallback(data)
{
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

function clearHtml()
{
  $('#locationInput').val("");
  $('#locationInput').attr("data-search", "");
}

function draw() {
  if (ready)
  {  
    setBackgroundByTemp();

    for (i=0; i<balls.length; i++)
    {
      balls[i].update();
      balls[i].show();
    }

    drawInformation();
    drawArrow();
  }

}
