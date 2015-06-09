//  djluna: Daniel Luna
//  object.js
//

var objects = [];
var objSelected = -1;
//matrix with time for each splash
var splashes = [];

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
   this.lifetime = 6;
   this.smooth = (!(!(smooth)));
   this.dynamic = false;
   
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
      if (this.model == BRICK_MODEL) {
         //Set lifetime such that z = -5
         this.lifetime = (-1 * this.velocity[2] - Math.sqrt(this.velocity[2]*this.velocity[2] + 2*9.81*(this.position[2] + 10))) / -9.81;
      } else if (this.model == SPLASH_MODEL) {
         //Set lifetime such that z = 0
         this.lifetime = (-1 * this.velocity[2] - Math.sqrt(this.velocity[2]*this.velocity[2] + 2*9.81*(this.position[2] + 0))) / -9.81;
      }
   } else {
      this.dynamic = false;
      this.lifetime = 6;
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
};


Object.prototype.setModel = function(model_id) {
   // Updates the model id if a valid id is passed
   if ((model_id < models.length) && (model_id >= 0)) {
      this.model = model_id;
   }
};


Object.prototype.draw = function(vBuffer, nBuffer) {
   // Draws the object using it's current settings
   
   var thisTime = parseFloat(timeSlider.value) - this.initTime;
   if ( (thisTime >= 0) && (thisTime <= this.lifetime) ) {
      var translationMatrix;
      var rotationMatrix;
      var modelWorldMatrix;
      
      //Send Shader modelViewMatrix and vecModelViewMatrix
      if (this.dynamic) {
         var currentPos = this.getPosition();
         translationMatrix = translate(currentPos);
      } else {
         translationMatrix = translate(this.position);
      }
      
      if (this.angularVelocity != 0) {
         rotationMatrix = rotate(this.angularVelocity * parseFloat(timeSlider.value), this.axisOfRot);
         modelWorldMatrix = mult(translationMatrix, rotationMatrix);
      } else {
         modelWorldMatrix = translationMatrix;
      }
      gl.uniformMatrix4fv(modelWorldLoc, false, flatten(modelWorldMatrix));
      gl.uniformMatrix3fv(vecModelWorldLoc, false, flatten(inverse(trim(modelWorldMatrix, 3, 3), false)));
      
      models[this.model].draw(vBuffer, nBuffer);
   }
};


Object.prototype.getPosition = function() {
   var thisTime = parseFloat(timeSlider.value) - this.initTime;
   var currentPos = add(this.position, scaleVec(thisTime, this.velocity));
   currentPos = add(currentPos, scaleVec(.5*thisTime*thisTime, vec3(0, 0, -9.81)));
   return currentPos
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
         
         createObject(model, finalOffset, 0);
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
//Z is up, so you need the zVelocity, and you need where it starts, which is its Z
function splashTime(xVelocity, yVelocity, zVelocity,brickX, brickY, brickZ )
{
    var gravity = 9.81;
    
    
    //finding the z displacement
    var zDisplacement = (zVelocity * zVelocity) / (gravity * 2);
    //the max height
    var maxHeight = zDisplacement + brickZ;
    //finding time at the max height using t = (Vf - Vo) / a
    var tUp = (0 - zVelocity) / (-1 * gravity);
    //finding the time it takes to go down using d = 1/2at^2
    var tDown = Math.sqrt((2 * maxHeight) / gravity);
    var totalTime = tUp + tDown;
    
    var xCoord = brickX + (xVelocity * totalTime);
    var yCoord = brickY = (yVelocity * totalTime);
    var zCoord = 0;
    var result = new vec4(xCoord, yCoord, zCoord, totalTime);
    return result;
    //return totalTime;
}