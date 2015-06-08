// djluna
// input.js

var timeSlider;
var timeLabel;

var angleSlider;
var angleLabel;

var playButton;
var playing = false;

var xSlider;
var xLabel;
//------------------------------
var zSlider;
var zLabel;
//------------------------------
var explosionMag = 300;
var magSlider;
var magLabel

var sXSlider;
var sXLabel;

var sZSlider;
var sZLabel;

var sYSlider;
var sYLabel;

//default cone globals ---- source, direction, angle, magnitude
var explosionSource = vec3(0, -3, 1);
//+right,,+up
var explosionDirection = vec3(0, 1, 1);

var intervalID = 0;


function setUpInput() {
   timeSlider = document.getElementById("timeSlider");
   timeLabel = document.getElementById("timeLabel");
   timeSlider.onchange = updateTimeSlider;
   playButton = document.getElementById("playButton");
   playButton.onclick = playPress;
   angleSlider = document.getElementById("angleSlider");
   angleLabel = document.getElementById("angleLabel");
   angleSlider.onchange = updateAngleSlider;
   //---------------------------------------------------------------------------
   // explosion direction x translation
   xSlider = document.getElementById("xSlider");
   xLabel = document.getElementById("xLabel");
   xSlider.onchange = updateXSlider;
   
   //explosion direction z translation
   
   zSlider = document.getElementById("zSlider");
   zLabel = document.getElementById("zLabel");
   zSlider.onchange = updateZSlider;
   
   //---------------------------------------------------------------------------
   
   magSlider = document.getElementById("magSlider");
   magLabel = document.getElementById("magLabel");
   magSlider.onchange = updateMagSlider;
   
   //---------------------------------------------------------------------------
   sXSlider = document.getElementById("sXSlider");
   sXLabel = document.getElementById("sXLabel");
   sXSlider.onchange = updateSXSlider;
   
   sYSlider = document.getElementById("sYSlider");
   sYLabel = document.getElementById("sYLabel");
   sYSlider.onchange = updateSYSlider;
   
   sZSlider = document.getElementById("sZSlider");
   sZLabel = document.getElementById("sZLabel");
   sZSlider.onchange = updateSZSlider;
   
};


function updateTimeSlider() {
   timeLabel.innerHTML = timeSlider.value;
   render();
};


function playPress() {
   playing = !(playing);
   if (playing) {
      if (parseFloat(timeSlider.value) == 6)
         timeSlider.value = "0";
      playButton.innerHTML = "Pause";
      intervalID = setInterval(function(){
         if (parseFloat(timeSlider.value) < 6) {
            var temp = parseFloat(timeSlider.value) + .04;
            timeSlider.value = temp.toString();
            updateTimeSlider();
         } else {
            playPress();
         }
      }, 40);
   } else {
      playButton.innerHTML = "Play";
      clearInterval(intervalID);
   }
};


function updateAngleSlider()
{
   angleLabel.innerHTML = angleSlider.value;
   resetObjects();
}

function updateXSlider()
{
   explosionDirection[0] = xSlider.value;
   //console.log(explosionDirection);
   xLabel.innerHTML = xSlider.value;
   resetObjects();
   //console.log(explosionDirection);
}

function updateZSlider()
{
   explosionDirection[2] = zSlider.value;
   //console.log(explosionDirection);
   zLabel.innerHTML = zSlider.value.toString();
   resetObjects();
   //console.log(explosionDirection);
}

function updateMagSlider()
{
   explosionMag = magSlider.value;
   //console.log(explosionDirection);
   magLabel.innerHTML = magSlider.value;
   resetObjects();
   //console.log(explosionDirection);
}

function updateSXSlider()
{
   explosionSource[0] = sXSlider.value;
   //console.log(explosionDirection);
   sXLabel.innerHTML = sXSlider.value;
   resetObjects();
   //console.log(explosionDirection);
}

function updateSYSlider()
{
   explosionSource[1] = sYSlider.value;
   //console.log(explosionDirection);
   sYLabel.innerHTML = sYSlider.value;
   resetObjects();
   //console.log(explosionDirection);
}

function updateSZSlider()
{
   explosionSource[2] = sZSlider.value;
   //console.log(explosionDirection);
   sZLabel.innerHTML = sZSlider.value;
   resetObjects();
   //console.log(explosionDirection);
}