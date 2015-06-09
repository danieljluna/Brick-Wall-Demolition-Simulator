/*
 * djluna: Daniel Luna and John Baden
 * 24 April 2015
 * This is the main javascript file responsible for the final program.
 *    This program uses a series of text boxes to allow the user to 
 *    create multiple copies a of a single mesh and manipulate each 
 *    copy's position, size, and orientation as needed. Alt + (0 - 9)
 *    selects a shark, and the update button is used to finalize new
 *    settings.
 */

//Global Variables:

//Display Variables
var canvas;
var gl;

//Buffer and Point Data
var vBuffer;
var nBuffer;
var pointSize = 16;

//Holds whether we are using perspective
var doPerspective = true;

//Stores the location of the modelViewMatrix in the shader
var objPosLoc;
var reflectionRenderLoc;
var surfDiffuseLoc;
var surfSpecularLoc;
var shininessLoc;
var surfAmbientLoc;
var modelWorldLoc;
var vecModelWorldLoc;
var worldViewLoc;
var vecWorldViewLoc;

//Matrices to save transforms
var worldViewMatrix;
var vecWorldViewMatrix;

//Store canvas offset for canvas on page:
var offset;

var eyeVec = vec4(20, -100, 50, 1);

var WATER_MODEL;
var FLOOR_MODEL;
var BRICK_MODEL;
var SPLASH_MODEL;
var BAZOOKA_MODEL;
var BRICK_START;

//Onload init() function:
window.onload = function init() {
   canvas = document.getElementById( "canvas" );
   offset = canvas.getBoundingClientRect();
   
   setUpInput();
   
   gl = WebGLUtils.setupWebGL( canvas );
   if ( !gl ) { alert( "WebGL isn't available" ); }
   
   //Inform gl of the portion of the canvas we want to draw on
   gl.viewport( 0, 0, canvas.width, canvas.height );
   //Set the COLOR_BUFFER_BIT to the color defined below in an rgba fashion
   gl.clearColor( 0.5, 0.5, 0.7, 1.0 );
   
   gl.enable(gl.DEPTH_TEST);
   
   //
   //  Load shaders and initialize attribute buffers
   //
   var program = initShaders( gl, vertexShaderSource, fragmentShaderSource );
   //Use the shaders generated above
   gl.useProgram( program );
   
   //Create a buffer for the vertex positions
   vBuffer = gl.createBuffer();
   //Bind that buffer to gl's ARRAY_BUFFER
   gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
   
   //Store the address of the shader's vPosition attribute
   var vPosition = gl.getAttribLocation(program, "vPosition");
   //Set the data format of vPosition to be 4 floats
   gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
   //Enables the vertex attribute that we just created
   gl.enableVertexAttribArray(vPosition);
   
   //Create a buffer for the normals
   nBuffer = gl.createBuffer();
   //Bind that buffer to gl's ARRAY_BUFFER
   gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
   
   //Store the address of the shader's vVertNormal attribute
   var vNormal = gl.getAttribLocation(program, "vNormal");
   //Set the data format of vNormal to be 4 floats
   gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
   //Enable normal attribute
   gl.enableVertexAttribArray(vNormal);
   
   //Store the index of the shader's modelViewMatrix
   worldViewLoc = gl.getUniformLocation(program, "worldViewMatrix");
   //Create worldView Matrix
   worldViewMatrix = lookAt(vec3(0, 0, 0), scaleVec(.008, vec3(eyeVec)), vec3(0, 0, 1));
   worldViewMatrix = mult(worldViewMatrix, scale(0.075, 0.075, 0.075));
   //Create perspective Matrix
   perspectiveMatrix = mat4(1);
   perspectiveMatrix[3][2] = 1 / 1.5;   //account for perspective
   if (doPerspective)
      worldViewMatrix = mult(perspectiveMatrix, worldViewMatrix);
   
   //Store the index of the shader's vecModelViewMatrix
   vecWorldViewLoc = gl.getUniformLocation(program, "vecWorldViewMatrix");
   //Store the transform into normalWorldViewMatrix
   var vecWorldViewMatrix = inverse(trim(worldViewMatrix, 3, 3));
   
   gl.uniformMatrix4fv(
      gl.getUniformLocation(program, "worldViewMatrix"),
      false, 
      flatten(worldViewMatrix)
   );
   gl.uniformMatrix3fv(
      gl.getUniformLocation(program, "vecWorldViewMatrix"),
      false, 
      flatten(vecWorldViewMatrix)
   );
   
   //Send lightVec to shader
   var lightVecLoc = gl.getUniformLocation(program, "lightVec");
   gl.uniform4fv(lightVecLoc, flatten(transformPoint(worldViewMatrix, vec4(0, 100, 1000, 0))));
   
   //Send eyeVec to shader
   var eyeVecLoc = gl.getUniformLocation(program, "eyeVec");
   gl.uniform4fv(eyeVecLoc, flatten(transformPoint(worldViewMatrix, eyeVec)));
   
   //Send shininess to shader
   var lightPropLoc = gl.getUniformLocation(program, "lightProperties");
   gl.uniform4fv(lightPropLoc, flatten(vec4(0.9, 0.9, 0.9, 1.0)));
   
   //Store Shading Variables
   objPosLoc = gl.getUniformLocation(program, "objPos");
   reflectionRenderLoc = gl.getUniformLocation(program, "reflectionRender");
   surfDiffuseLoc = gl.getUniformLocation(program, "surfaceDiffuse");
   surfSpecularLoc = gl.getUniformLocation(program, "surfaceSpecular");
   shininessLoc = gl.getUniformLocation(program, "surfaceShininess");
   surfAmbientLoc = gl.getUniformLocation(program, "surfaceAmbient");
   modelWorldLoc = gl.getUniformLocation(program, "modelWorldMatrix");
   vecModelWorldLoc = gl.getUniformLocation(program, "vecModelWorldMatrix");
   
   WATER_MODEL = createModel(WATER_COORD, WATER_POLY, vec4(0, 0, 0, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 15, false);
   models[WATER_MODEL].surfaceAmbient = vec4(0.05, 0.3, 0.6, 1.0);
   createObject(WATER_MODEL, vec4(0, 0, -10), 0);
   
   FLOOR_MODEL = createModel(FLOOR_COORD, FLOOR_POLY, vec4(0, 0, 0, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 10, false);
   models[FLOOR_MODEL].surfaceAmbient = vec4(0.1, 0.25, 0.1, 1.0);
   createObject(FLOOR_MODEL, vec4(0, 0, .1), 0);
   
   BRICK_MODEL = createModel(BRICK_COORD, BRICK_POLY, vec4(0.7, 0.35, 0.35, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 10, false);
   models[BRICK_MODEL].surfaceAmbient = vec4(.1, .05, .05, 1.0);
   BRICK_START = createRows(BRICK_MODEL, 10, 9, vec4(0, 0, .35, 1), vec4(1.81, 0, 0, 0), vec4(0, 0, .55, 0));
   
   SPLASH_MODEL = createModel(SPLASH_COORD, SPLASH_POLY, vec4(0.05, 0.3, 0.6, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 15, true);
   
   BAZOOKA_MODEL = createModel(BAZOOKA_COORD, BAZOOKA_POLY, vec4(.8, .8, 0.8, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 10, false);
   //createObject(BAZOOKA_MODEL, vec4(0,-5, 2), 0);
   resetObjects();
};

    
//Draw Functions:
function render() {
   //Draws all of the objects in the scene
   
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
   gl.uniform1f(reflectionRenderLoc, false);
   for (var obj = 0; obj < objects.length; ++obj) {
      objects[obj].draw(vBuffer, nBuffer);
   }
   
   if ((doReflections) && (timeSlider.value != "0")) {
      gl.uniform1f(reflectionRenderLoc, true);
      for (var obj = BRICK_START; (obj < objects.length) && (objects[obj].model != SPLASH_MODEL); ++obj) {
         if ((objects[obj].dynamic) && (objects[obj].getPosition()[2] > 0)) {
            gl.uniform4fv(objPosLoc, flatten(vec4(objects[obj].getPosition(), 0)));
            objects[obj].draw(vBuffer, nBuffer);
         }
      }
   }
};


function resetObjects() {
   var splashObjs = 0;
   for (obj = 0; obj < objects.length; ++obj) {
      switch (objects[obj].model) {
      case BRICK_MODEL:  //For bricks
         objects[obj].setVelocity([0,0,0]);
         objects[obj].setRotation(0, vec3(0, 0, 1));
         break;
      case SPLASH_MODEL:  //For splashes
         objects.splice(obj, objects.length - obj);
         break;
      }
   }
   
   createConeExplosion(explosionSource, explosionDirection, angleSlider.value, explosionMag);
   render();
}


function createConeExplosion(source, direction, angle, magnitude) {
   var dirNorm = scaleVec(1 / Math.sqrt(dot(direction, direction)), direction);
   for (obj = BRICK_START; (objects[obj].model == BRICK_MODEL); ++obj) {
      if(coneCollision(source, direction, angle, objects[obj].position) == false)
      {
        var distance = subtract(objects[obj].position, source);
        var distNorm = scaleVec(1 / Math.sqrt(dot(distance, distance)), distance);
        velocity = scaleVec(magnitude * dot(distNorm, dirNorm) / dot(distance, distance), distNorm);
        objects[obj].setVelocity(velocity);
        var objPos = objects[obj].position;
        var rotationVector = vec3(
           direction[1]*(objPos[2] - source[2]) - direction[2]*(source[1] - objPos[1]),
           direction[0]*(source[2] - objPos[2]) - direction[2]*(objPos[0] - source[0]),
           direction[0]*(objPos[1] - source[1]) - direction[1]*(source[0] - objPos[0])
        );
        var mag = Math.sqrt(dot(rotationVector, rotationVector));
        rotationVector = scaleVec(-1.0 / mag, rotationVector);
        objects[obj].setRotation(magnitude*mag / 3, rotationVector);
        
        var splashCoords = splashTime(objects[obj].velocity[0], objects[obj].velocity[1], objects[obj].velocity[2],
        objects[obj].position[0], objects[obj].position[1], objects[obj].position[2]);
        var impactVelocity = [objects[obj].velocity[0], objects[obj].velocity[1], objects[obj].velocity[2]];
        impactVelocity[2] = impactVelocity[2] - 9.81 * splashCoords[3];
        createSplash([splashCoords[0], splashCoords[1]], impactVelocity, splashCoords[3]);
      }
   }
};

function createSplash(pos, impactVel, time)
{
    var impactMag = Math.sqrt(impactVel[0]*impactVel[0] + impactVel[1]*impactVel[1] + impactVel[2]*impactVel[2]);
    impactVel = scaleVec(5 / impactMag, vec3(impactVel));
    var random = Math.floor(Math.random() * 5 + impactMag - 5);
    for( i = 0; i <random ; i++)
    {
        var randomX = 2 * Math.random() - 1;
        var randomY = 2 * Math.random() - 1;
        
        var newObject = createObject(SPLASH_MODEL, vec4(pos[0] + randomX , pos[1] + randomY, 0), time);
        var rVelX = 2 * randomX - impactVel[0];
        var rVelY = 2 * randomY - impactVel[1];
        var rVelZ = impactMag/2 - Math.sqrt(rVelX*rVelX + rVelY*rVelY) + 5*Math.random();
        objects[newObject].setVelocity([rVelX, rVelY, rVelZ]);
    }
}