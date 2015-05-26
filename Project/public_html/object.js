//  djluna: Daniel Luna
//  object.js
//

var objects = [];
var objSelected = -1;
var defaultConeOrigin = [0,-10,0];
var yAxis = [0,1,0];
//THIS IS THE ONE LINE IM TRYING RIGHT NOW AT 9:36 PM

// Object Class
var Object = function(model_id, pos) {
   // Creates an object with the given model, transformationMatrix, and
   //    uses the boolean 'smooth' to denote if the object should use
   //    flat or smooth shading.
   if ((model_id < models.length) && (model_id >= 0)) {
      this.model = model_id;
   } else {
      this.model = 0;
   }
   
   this.position = vec3(pos[0], pos[1], pos[2]);
   this.velocity = vec3(0, 0, 0);
   
   //Holds transform from model to world
   this.modelWorldMatrix = translate(pos[0], pos[1], pos[2]);
   
   //Object index in objects
   this.id = objects.push(this) - 1;
};


Object.prototype.setVelocity = function(vx, vy, vz) {
   if ( Array.isArray(vx) && vx.length == 3 ) {
      vz = vx[2];
      vy = vx[1];
      vx = vx[0];
   }
   
   this.velocity = vec3(vx, vy, vz);
};


Object.prototype.setModel = function(model_id) {
   // Updates the model id if a valid id is passed
   if ((model_id < models.length) && (model_id >= 0)) {
      this.model = model_id;
   }
};


Object.prototype.draw = function(vBuffer, nBuffer) {
   // Draws the object using it's current settings
   
   //Send Shader modelViewMatrix and vecModelViewMatrix
   var modelViewMatrix = mult(worldViewMatrix, this.modelWorldMatrix);
   if (doPerspective)
      modelViewMatrix = mult(perspectiveMatrix, modelViewMatrix);
   gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix3fv(vecModelViewLoc, false, flatten(inverse(trim(modelViewMatrix, 3, 3), false)));
   
   gl.uniform4fv(velocityLoc, flatten(vec4(this.velocity, 0)));
   
   models[this.model].draw(vBuffer, nBuffer);
};


// Create Object and return its id
function createObject(model_id, transformMatrix, smooth) {
   var obj = new Object(model_id, transformMatrix, smooth);
   return obj.id;
};
//user defined point that determines direction, point [x,y,z], vector
//cone base is fixed at [0,-10,0]
//standard direction is [0,1,0]
//larger than angle = outside cone
function coneCollision(coneDirection,angleOfCone, brickCOM)
{
    if(angleOfCone > 90)
    {
        console.log("the hell is wrong with your cone?");
        return;
    }
    //cone direction vector
    var a = coneDirection[0] - defaultConeOrigin[0];
    var b = coneDirection[1] - defaultConeOrigin[1];
    var c = coneDirection[2] - defaultConeOrigin[2];
    var coneVector = new vec3(a, b, c);
    
    // vector from cone origin to COM of brick
    a = brickCOM[0] - defaultConeOrigin[0];
    b = brickCOM[1] - defaultConeOrigin[1];
    c = brickCOM[2] - defaultConeOrigin[2];
    var brickVector = new vec3(a, b, c);
    
    //finding the magnitude of each
    var coneMag = Math.sqrt(Math.pow(coneVector[0],2) + Math.pow(coneVector[1],2)
            + Math.pow(coneVector[2],2));
    var brickMag = Math.sqrt(Math.pow(brickVector[0],2) + Math.pow(brickVector[1],2)
            + Math.pow(brickVector[2],2));
    //gets cosine theta
    var cosTheta = (dot(coneVector, brickVector))/(coneMag * brickMag);
    //Math.acos returns a value in radians, so im converting it to degrees here.
    var angle = (Math.acos(cosTheta)) * (180/Math.PI);
    //--------------------comparing values
    if(angleOfCone < angle)
    {
        return true;
    }
    else if(angleOfCone > angle)
    {
        return false;
    }
    else
    {
        console.log("they're equal, returning true");
        return true;
        
    }
}