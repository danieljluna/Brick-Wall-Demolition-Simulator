// djluna
// input.js

var timeSlider;
var timeLabel;
var angleSlider;
var angleLabel;

function setUpInput() {
   timeSlider = document.getElementById("timeSlider");
   timeLabel = document.getElementById("timeLabel");
   timeSlider.onchange = updateTimeSlider;
   angleSlider = document.getElementById("angleSlider");
   angleLabel = document.getElementById("angleLabel");
   angleSlider.onchange = updateAngleSlider;
};

function updateTimeSlider() {
   timeLabel.innerHTML = timeSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   render();
};

function updateAngleSlider()
{
   angleLabel.innerHTML = angleSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   for (obj = 0; obj < objects.length; ++obj) 
   {
      objects[obj].setVelocity([0,0,0]);
   }
   createConeExplosion(vec3(0, -10, 3.24), vec3(0, 1, 0), angleSlider.value, 5);
   updateTimeSlider();
}
