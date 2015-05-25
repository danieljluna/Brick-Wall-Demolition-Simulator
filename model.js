//  djluna: Daniel Luna
//  model.js
//

var models = [];
var modelLoaded = -1;

// Model object
var Model = function(coords, polys, diffuse, specular, shininess) {
   this.vertices = [];
   this.indices = [];
   this.vertNormals = [];
   this.surfNormals = [];
   
   this.smoothShaded = false;
   this.surfaceDiffuse = vec4(diffuse);
   this.surfaceSpecular = vec4(specular);
   this.surfaceShininess = shininess;
   this.surfaceAmbient = scaleVec(0.1, this.surfaceDiffuse);
   
   this.loadModel(coords, polys);
   
   this.id = models.push(this) - 1;
};


Model.prototype.loadModel = function(coordArray, polyArray) {
   // Loads the model given by the coordArray and polyArray passed. The
   //    final vertices are loaded into the vertices array and the 
   //    normals are calculated and loaded into the normal array.
   
   // Set bufferItemSize to the length of the coordArray for rendering.
   bufferItemSize = coordArray.length;
   
   this.indices = [];
   this.vertices = [];
   this.vertNormals = [];
   this.surfNormals = [];
   
   // Loop through polygons in polyArray:
   for (var poly = 0; poly < polyArray.length; ++poly) {
      // Get the color for this piece of the model and apply it to the
      //    models found in this poly. Also, store the normal for each
      //    polygon.
      
      var oldIndices = this.indices.length;
      // Remove body string at position zero
      polyArray[poly].splice(0, 1);
      // Align indices to zero instead of 1
      for (var i = 0; i < polyArray[poly].length; ++i) {
         polyArray[poly][i] = polyArray[poly][i] - 1;
      }
      //Push triangles into indices array
      this.indices = this.indices.concat(triangulatePolygon(polyArray[poly]));
      
      for (var i = oldIndices; i < this.indices.length; i += 3) {
         // Find the normal of this triangle for use later.
         this.surfNormals.push(calculateNormal([this.indices[i], this.indices[i + 1], this.indices[i + 2]], coordArray));
      }
   }
   
   //Loop through the points in coordArray
   for (var point = 0; point < coordArray.length; ++point) {
      // Find the normal of each point and save it in the 
      //    normalReference array. Also, add each point in vec4
      //    format to the vertices array.
      
      //Format point
      var temp = vec4(coordArray[point][0], coordArray[point][1], coordArray[point][2], 1.0);
      this.vertices.push(temp);
      
      //Calculate Point Normal
      var avgNormal = vec4(0, 0, 0, 0);
      for (var i = this.indices.indexOf(point, 0); i != -1; i = this.indices.indexOf(point, i + 1)) {
         avgNormal = add(avgNormal, this.surfNormals[Math.floor(i / 3)]);
      }
      //Store Point Normal
      this.vertNormals.push(avgNormal);
   }
};


// Fills the buffers with the appropriate data for drawing
Model.prototype.draw = function(vBuffer, nBuffer, bufferItemSize) {
   // If this model is not currently loaded, loads this model. Then draws
   
   if (modelLoaded != this.id) {
      modelLoaded = this.id;
      
      //Updates shader shading variables
      gl.uniform4fv(surfDiffuseLoc, flatten(this.surfaceDiffuse));
      gl.uniform4fv(surfSpecularLoc, flatten(this.surfaceSpecular));
      gl.uniform1f(shininessLoc, this.surfaceShininess);
      gl.uniform4fv(surfAmbientLoc, flatten(this.surfaceAmbient));
      
      var temp = [];
      for (var i = 0; i < this.indices.length; ++i) {
         for (var j = 0; j < this.vertices[0].length; ++j) {
            temp.push(this.vertices[this.indices[i]][j]);
         }
      }
      
      //Buffer in vertices
      gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp), gl.STATIC_DRAW);
      
      var temp = [];
      //Depending on shading, copy in proper normals
      if (this.smoothShaded) {
         for (var i = 0; i < this.indices.length; ++i) {
            for (var j = 0; j < this.vertNormals[0].length; ++j) {
               temp.push(this.vertNormals[this.indices[i]][j]);
            }
         }
      } else {
         //Copy just as many surface normals as vertices into the nBuffer
         for (var i = 0; i < this.indices.length; ++i) {
            for (var j = 0; j < this.surfNormals[0].length; ++j) {
               temp.push(this.surfNormals[Math.floor(i / 3)][j]);
            }
         }
      }
      
      //Bind the nBuffer for manipulation
      gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp), gl.STATIC_DRAW);
   }
   
   //Draw triangles
   gl.drawArrays(gl.TRIANGLES, 0, this.indices.length);
};


//Create model and return only its id.
function createModel(coords, polys, diffuse, specular, shininess) {
   model = new Model(coords, polys, diffuse, specular, shininess);
   return model.id;
};


function triangulatePolygon(polygon) {
   // Takes in an array of points that comprise a polygon and returns
   //    a re-ordered array of triangles (3-point arrays) that form the
   //    original polygon. Maintains orientation of original points.
   
   // An array for storing the resulting triangles.
   var result = [];
   
   var len = polygon.length;
   
   if (len == 3) {
   // If polygon consists of 3 points, simply return those three 
   //    points.
      result.push(polygon[0], polygon[1], polygon[2]);
   } else if (len > 3) {
   // If it is more than 3 points, remove one point by removing a 
   //    triangle from the polygon. Then call recursively. Alternate
   //    point removed by checking if the number of points in the 
   //    polygon is odd or even.
      if (len % 2 == 0) {
         result.push(
            polygon[len - 2],
            polygon[len - 1],
            polygon[0]
            );
         polygon.splice(len - 1, 1);
      } else {
         result.push(
            polygon[len - 1],
            polygon[0],
            polygon[1]
            );
         polygon.splice(0, 1);
      }
      result = result.concat(triangulatePolygon(polygon));
   }
      
   return result;
};


function calculateNormal(polygon, coordArray) {
   // Uses the first 3 vertices to calculate a normal to the polygon.
   //    Assumes the points are ordered correctly.
   
   var origin = vec4(coordArray[polygon[1]][0], coordArray[polygon[1]][1], coordArray[polygon[1]][2], 1.0);
   var A = subtract(
         vec4(coordArray[polygon[2]][0], coordArray[polygon[2]][1], coordArray[polygon[2]][2], 1.0),
         origin
      );
   var B = subtract(
         vec4(coordArray[polygon[0]][0], coordArray[polygon[0]][1], coordArray[polygon[0]][2], 1.0),
         origin
      );
   var result = cross(B, A);
   
   result = vec4(result[0], result[1], result[2], 0.0);
   
   return result;
};


// Add rows of an object defined by offests
function createRows(model, perRow, rows, origin, objOffset, rowOffset) {
   
   var offset = origin;
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
         offset = add(scaleVec(0.5, objOffset), rowOffset);
      } else if (r % 2 == 0) {
         offset = add(scaleVec(0.5, objOffset), add(offset, rowOffset));
      } else {
         offset = add(scaleVec(-0.5, objOffset), add(offset, rowOffset));
      }
   }
   
}
