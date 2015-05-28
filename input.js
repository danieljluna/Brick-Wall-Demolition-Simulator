// djluna
// input.js

var timeSlider;
var timeLabel;
var angleSlider;
var angleLabel;
var playButton;
var playing = false;

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
};


function updateTimeSlider() {
   timeLabel.innerHTML = timeSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   render();
};


function playPress() {
   playing = !(playing);
   if (playing) {
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
   angleLabel.innerHTML = angleSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   for (obj = 0; obj < objects.length; ++obj) 
   {
      objects[obj].setVelocity([0,0,0]);
   }
   createConeExplosion(vec3(0, -2, 0.45), vec3(0, 1, 1), angleSlider.value, 15);
   updateTimeSlider();
}
