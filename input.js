// djluna
// input.js

var timeSlider;
var timeLabel;

function setUpInput() {
   timeSlider = document.getElementById("timeSlider");
   timeLabel = document.getElementById("timeLabel");
   angleSlider = document.getElementById("angleSlider");
   angleSlider.onchange = updateAngle;
   timeSlider.onchange = updateSlider;
};

function updateSlider() {
   timeLabel.innerHTML = timeSlider.value.toString();
   gl.uniform1f(timeLoc, timeSlider.value);
   render();
};

function updateAngle()
{
    console.log("hello there!");
    console.log(angleSlider.value);
    for (obj = 0; obj < objects.length; ++obj) 
    {
        objects[obj].setVelocity([0,0,0]);
    }
    createConeExplosion(vec3(0, -20, 0), vec3(0, 20, 0), angleSlider.value, 5);
    timeSlider.value = 0;
    timeLabel.innerHTML = timeSlider.value.toString();
    updateSlider();
    //render();
}
