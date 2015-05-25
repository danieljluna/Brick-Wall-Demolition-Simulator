/*
 * djluna: Daniel Luna
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
var iBuffer;
var pointSize = 16;

//Holds whether we are using perspective
var doPerspective = false;

//Stores the location of the modelViewMatrix in the shader
var modelViewLoc;
var vecModelViewLoc;
var surfDiffuseLoc;
var surfSpecularLoc;
var shininessLoc;
var surfAmbientLoc;
var velocityLoc;
var timeLoc;

//Matrices to save transforms
var worldViewMatrix;
var perspectiveMatrix;
var vecWorldViewMatrix;

//Store canvas offset for canvas on page:
var offset;

var eyeVec = vec4(100, -100, 100, 0);

//Stores clicking bounding box
var boundingBox = [-75, 10, -20, 50, -12, 20];

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
   gl.clearColor( 0.0, 0.1, 0.3, 1.0 );
   
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
   
   //Create index buffer
   iBuffer = gl.createBuffer();
   //Bind that buffer to gl's ELEMENT_ARRAY_BUFFER
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
   
   //Store the index of the shader's modelViewMatrix
   modelViewLoc = gl.getUniformLocation(program, "modelViewMatrix");
   //Create worldView Matrix
   worldViewMatrix = lookAt(vec3(0, 0, 0), scaleVec(.008, vec3(eyeVec)), vec3(0, 0, 1));
   worldViewMatrix = mult(worldViewMatrix, scale(0.008, 0.008, 0.008));
   //Create perspective Matrix
   perspectiveMatrix = mat4(1);
   perspectiveMatrix[3][2] = 1 / 2;   //account for perspective
   
   //Store the index of the shader's vecModelViewMatrix
   vecModelViewLoc = gl.getUniformLocation(program, "vecModelViewMatrix");
   //Store the transform into normalWorldViewMatrix
   var vecWorldViewMatrix = inverse(worldViewMatrix, false);
   
   //Send lightVec to shader
   var lightVecLoc = gl.getUniformLocation(program, "lightVec");
   gl.uniform4fv(lightVecLoc, flatten(transformPoint(worldViewMatrix, vec4(0, -160, 80, 0))));
   
   //Send eyeVec to shader
   var eyeVecLoc = gl.getUniformLocation(program, "eyeVec");
   gl.uniform4fv(eyeVecLoc, flatten(transformPoint(worldViewMatrix, eyeVec)));
   
   //Send shininess to shader
   var lightPropLoc = gl.getUniformLocation(program, "lightProperties");
   gl.uniform4fv(lightPropLoc, flatten(vec4(0.9, 0.9, 0.9, 1.0)));
   
   //Store Shading Variables
   surfDiffuseLoc = gl.getUniformLocation(program, "surfaceDiffuse");
   surfSpecularLoc = gl.getUniformLocation(program, "surfaceSpecular");
   shininessLoc = gl.getUniformLocation(program, "surfaceShininess");
   surfAmbientLoc = gl.getUniformLocation(program, "surfaceAmbient");
   velocityLoc = gl.getUniformLocation(program, "velocity");
   timeLoc = gl.getUniformLocation(program, "time");
   gl.uniform1f(timeLoc, 0);
   
   //Create Bricks
   createModel(BRICK_COORD, BRICK_POLY, vec4(0.8, 0.4, 0.4, 1.0), vec4(0.3, 0.3, 0.3, 1.0), 10);
   createRows(0, 10, 10, vec4(0, 0, 0, 1), vec4(17.9, 0, 0, 0), vec4(0, 0, 5.3, 0));
   
   createConeExplosion(vec3(0, -20, 0), vec3(0, 20, 0), 180, 10);
   
   render();
};


//Draw Functions:
function render() {
   //Draws all of the objects in the scene
   
   gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   
   for (var obj = 0; obj < objects.length; ++obj) {
      objects[obj].draw(vBuffer, nBuffer, bufferItemSize);
   }
   
};


function createConeExplosion(source, direction, angle, magnitude) {
   for (obj = 0; obj < objects.length; ++obj) {
      var velocity = subtract(objects[obj].position, source)
      velocity = scaleVec(magnitude / Math.sqrt(dot(velocity, velocity)), velocity);
      objects[obj].setVelocity(velocity);
   }
};