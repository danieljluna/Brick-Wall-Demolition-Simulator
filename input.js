// djluna
// input.js

var timeSlider;
var timeLabel;

function setUpInput() {
   timeSlider = document.getElementById("timeSlider");
   timeLabel = document.getElementById("timeLabel");
   timeSlider.onchange = updateSlider;
};

function updateSlider() {
   timeLabel.innerHTML = timeSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   render();
};
