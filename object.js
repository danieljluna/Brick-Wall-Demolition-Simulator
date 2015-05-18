//  djluna: Daniel Luna
//  object.js
//

var objects = [];
var objSelected = -1;

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


Object.prototype.setVelocity(vx, vy, vz) {
   if ( Array.isArray(vx) && vx.length == 3 ) {
      vz = vx[2];
      vy = vx[1];
      vx = vx[0];
   }
   
   this.velocity = vec3(x, y, z);
};


Object.prototype.setModel = function(model_id) {
   // Updates the model id if a valid id is passed
   if ((model_id < models.length) && (model_id >= 0)) {
      this.model = model_id;
   }
};


Object.prototype.draw = function(vBuffer, nBuffer, bufferItemSize) {
   // Draws the object using it's current settings
   
   //Send Shader modelViewMatrix and vecModelViewMatrix
   var modelViewMatrix = mult(worldViewMatrix, this.modelWorldMatrix);
   if (doPerspective)
      modelViewMatrix = mult(perspectiveMatrix, modelViewMatrix);
   gl.uniformMatrix4fv(modelViewLoc, false, flatten(modelViewMatrix));
   gl.uniformMatrix3fv(vecModelViewLoc, false, flatten(inverse(trim(modelViewMatrix, 3, 3), false)));
   
   models[this.model].draw(vBuffer, nBuffer, bufferItemSize);
   if (objSelected == this.id) {
      var tempColor = vec4(0, 0, 0, 1);
      tempColor[0] = 0.7;
      drawBox(
         vec4(boundingBox[0], boundingBox[1], boundingBox[2], 1),
         vec4(boundingBox[3], boundingBox[4], boundingBox[5], 1),
         tempColor
      );
   }
};


// Create Object and return its id
function createObject(model_id, transformMatrix, smooth) {
   var obj = new Object(model_id, transformMatrix, smooth);
   return obj.id;
};

