//  djluna: Daniel Luna
//  object.js
//

var objects = [];
var objSelected = -1;

// Object Class
var Object = function(model_id, pos, initTime, smooth) {
   // Creates an object with the given model, transformationMatrix, and
   //    uses the boolean 'smooth' to denote if the object should use
   //    flat or smooth shading.
   if ((model_id < models.length) && (model_id >= 0)) {
      this.model = model_id;
   } else {
      this.model = -1;
   }
   
   this.position = vec3(pos[0], pos[1], pos[2]);
   this.velocity = vec3(0, 0, 0);
   this.angularVelocity = 0;
   this.axisOfRot = vec3(0, 0, 0);
   this.initTime = Math.max(initTime, 0);
   this.smooth = (!(!(smooth)));
   this.dynamic = false;
   
   //Holds transform from model to world
   this.translationMatrix = translate(pos[0], pos[1], pos[2]);
   this.rotationMatrix = mat4();
   
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
   if (dot(this.velocity, this.velocity) != 0) {
      this.dynamic = true;
   } else {
      this.dynamic = false;
   }
};


Object.prototype.setRotation = function(angVel, axisX, axisY, axisZ) {
   if ((Array.isArray(axisX)) && (axisX.length == 3)) {
      axisZ = axisX[2];
      axisY = axisX[1];
      axisX = axisX[0];
   }
   
   this.angularVelocity = angVel;
   this.axisOfRot = vec3(axisX, axisY, axisZ);
   this.rotationMatrix = rotate(this.angularVelocity * parseFloat(timeSlider.value), [axisX, axisY, axisZ]);
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
   if (this.angularVelocity != 0)
      this.rotationMatrix = rotate(this.angularVelocity * parseFloat(timeSlider.value), this.axisOfRot);
   gl.uniformMatrix4fv(rotMatLoc, false, flatten(this.rotationMatrix));
   var modelWorldMatrix = this.translationMatrix;
   var modelViewMatrix = mult(worldViewMatrix, modelWorldMatrix);
   if (doPerspective)
      modelViewMatrix = mult(perspectiveMatrix, modelViewMatrix);
   gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix3fv(vecModelViewLoc, false, flatten(inverse(trim(modelViewMatrix, 3, 3), false)));
   
   gl.uniform4fv(velocityLoc, flatten(vec4(this.velocity, 0)));
   gl.uniform1f(dynamicLoc, this.dynamic);
   
   models[this.model].draw(vBuffer, nBuffer);
};


// Create Object and return its id
function createObject(model_id, transformMatrix, initTime, smooth) {
   var obj = new Object(model_id, transformMatrix, initTime, smooth);
   return obj.id;
};



// Add rows of an object defined by offests
function createRows(model, perRow, rows, origin, objOffset, rowOffset) {
   
   var offset = origin;
   var result = objects.length;
   for (var r = 0; r < rows; ++r) {
      
      for (var obj = 0; obj < perRow; ++obj) {
         
         if ((obj + 1) % 2 == 0) {
            finalOffset = add(scaleVec(-Math.floor((obj + 1) / 2), objOffset), offset);
         } else {
            finalOffset = add(scaleVec(Math.floor((obj + 1) / 2), objOffset), offset);
         }
         
         createObject(model, finalOffset);
      }
      
      if (r == 0) {
         offset = add(add(scaleVec(0.5, objOffset), rowOffset), origin);
      } else if (r % 2 == 0) {
         offset = add(scaleVec(0.5, objOffset), add(offset, rowOffset));
      } else {
         offset = add(scaleVec(-0.5, objOffset), add(offset, rowOffset));
      }
   }
   
   return result;
}



function coneCollision(coneSource, coneDirection, angleOfCone, brickCOM)
{
    if(angleOfCone > 90)
    {
        console.log("the hell is wrong with your cone?");
        return;
    }
    // vector from cone origin to COM of brick
    var brickVector = normalize(subtract(brickCOM, coneSource));
    
    //gets cosine theta
    var cosTheta = dot(normalize(coneDirection), brickVector);
    //Math.acos returns a value in radians, so im converting it to degrees here.
    var angle = (Math.acos(cosTheta)) * (180 / Math.PI);
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