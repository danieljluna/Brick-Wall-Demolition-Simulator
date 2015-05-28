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
var zSlider;
var zLabel;
//default cone globals ---- source, direction, angle, magnitude
var explosionSource;
//+right,,+up
var explosionDirection = vec3(0, 1, 0);


function setUpInput() {
   timeSlider = document.getElementById("timeSlider");
   timeLabel = document.getElementById("timeLabel");
   timeSlider.onchange = updateTimeSlider;
   playButton = document.getElementById("playButton");
   playButton.onclick = playPress;
   angleSlider = document.getElementById("angleSlider");
   angleLabel = document.getElementById("angleLabel");
   angleSlider.onchange = updateAngleSlider;
   // explosion direction x translation
   xSlider = document.getElementById("xSlider");
   xLabel = document.getElementById("xLabel");
   xSlider.onchange = updateXSlider;
   
   //explosion direction z translation
   
   zSlider = document.getElementById("zSlider");
   zLabel = document.getElementById("zLabel");
   zSlider.onchange = updateZSlider;
   
};


function updateTimeSlider() {
   timeLabel.innerHTML = timeSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   render();
};


function playPress() {
   /*
   playing = !(playing);
   if (playing) {
      playButton.innerHTML = "Pause";
      timeSlider.value += timeSlider.step;
   } else {
      playButton.innerHTML = "Play";
   }
   */
};


function updateAngleSlider()
{
   angleLabel.innerHTML = angleSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   for (obj = 0; obj < objects.length; ++obj) 
   {
      objects[obj].setVelocity([0,0,0]);
   }
   createConeExplosion(vec3(0, -2, 0.45), explosionDirection, angleSlider.value, 10);
   updateTimeSlider();
}

function updateXSlider()
{
   explosionDirection[0] = xSlider.value;
   console.log(explosionDirection);
   xLabel.innerHTML = xSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   for (obj = 0; obj < objects.length; ++obj) 
   {
      objects[obj].setVelocity([0,0,0]);
   }
   createConeExplosion(vec3(0, -2, 0.45), explosionDirection, angleSlider.value, 10);
   console.log(explosionDirection);
   updateTimeSlider();
}

function updateZSlider()
{
   explosionDirection[2] = zSlider.value;
   console.log(explosionDirection);
   zLabel.innerHTML = zSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   for (obj = 0; obj < objects.length; ++obj) 
   {
      objects[obj].setVelocity([0,0,0]);
   }
   createConeExplosion(vec3(0, -2, 0.45), explosionDirection, angleSlider.value, 10);
   console.log(explosionDirection);
   updateTimeSlider();
}

