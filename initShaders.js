//  djluna: Daniel Luna and jbaden: John Baden
//  initShaders.js
//

//Shader Sources:
vertexShaderSource = "\
   attribute vec4 vPosition;                          \n\
   attribute vec4 vNormal;                            \n\
                                                      \n\
   varying vec4 fColor;                               \n\
                                                      \n\
   uniform mat4 modelWorldMatrix;                     \n\
   uniform mat3 vecModelWorldMatrix;                  \n\
   uniform mat4 worldViewMatrix;                      \n\
   uniform mat4 vecWorldViewMatrix;                   \n\
                                                      \n\
   uniform vec4 objPos;                               \n\
   uniform vec4 eyeVec;                               \n\
   uniform vec4 lightVec;                             \n\
   uniform vec4 lightProperties;                      \n\
   uniform vec4 surfaceDiffuse;                       \n\
   uniform vec4 surfaceSpecular;                      \n\
   uniform float surfaceShininess;                    \n\
   uniform vec4 surfaceAmbient;                       \n\
   uniform bool reflectionRender;                     \n\
                                                      \n\
   void main()                                        \n\
   {                                                  \n\
      //Get the current Position                      \n\
      vec4 pos = modelWorldMatrix * vPosition;        \n\
                                                      \n\
      //Calculate light vector                        \n\
      vec3 L = normalize((lightVec - pos).xyz);       \n\
                                                      \n\
      //Calculate light vector                        \n\
      vec3 E = normalize((eyeVec - pos).xyz);         \n\
                                                      \n\
      //Normalize Normal vector                       \n\
      vec3 N = normalize(vecModelWorldMatrix*vNormal.xyz);\n\
                                                      \n\
      //Initialize fColor                             \n\
      fColor = vec4(0.0, 0.0, 0.0, 1.0);              \n\
                                                      \n\
      //Compute Diffuse                               \n\
      float N_L = max(dot(L, N), 0.0);                \n\
      fColor += surfaceDiffuse * lightProperties*N_L; \n\
                                                      \n\
      //Compute Specular                              \n\
      vec3 R = 2.0 * (N_L) * N - L;                   \n\
      float R_E = max(dot(R, E), 0.0);                \n\
      fColor += surfaceSpecular*lightProperties*pow(R_E,surfaceShininess);\n\
                                                      \n\
      //Compute Ambient                               \n\
      fColor += surfaceAmbient;                       \n\
                                                      \n\
      //Account For Excessive Color                   \n\
      fColor.r = min(1.0, fColor.r);                  \n\
      fColor.g = min(1.0, fColor.g);                  \n\
      fColor.b = min(1.0, fColor.b);                  \n\
      fColor.a = min(1.0, fColor.a);                  \n\
                                                      \n\
      //Handle Water Effects                          \n\
      if (!(reflectionRender)) {                      \n\
         //Handle Transparency                        \n\
         if (pos.z < 0.0) {                           \n\
            float waterAlpha = min(1.0, -pos.z*0.025 + .8);                         \n\
            fColor = vec4(0, 0.1, 0.2, 1.0)*waterAlpha + fColor*(1.0 - waterAlpha); \n\
         }                                            \n\
      } else {                                        \n\
         //Handle Reflections                         \n\
         float relativeZ = pos[2] - objPos[2];        \n\
         pos[2] = -1.0 * pos[2];                      \n\
         E[2] = -1.0 * E[2];                          \n\
         float t = -1.0 * pos[2] / E[2];              \n\
         pos = (pos + t * vec4(E, 0));                \n\
         pos[2] -= 0.01 * relativeZ;                  \n\
         float waterAlpha = .3;                       \n\
         fColor = vec4(0, 0.1, 0.2, 1.0)*waterAlpha + fColor*(1.0 - waterAlpha); \n\
      }                                               \n\
                                                      \n\
      //Pass Position to Fragment Shader              \n\
      vec4 temp = worldViewMatrix * pos;              \n\
      gl_Position = temp*vec4(1,1,0.1,1);             \n\
   }                                                  \n\
";

fragmentShaderSource = "\
   precision mediump float;         \n\
                                    \n\
   varying vec4 fColor;             \n\
                                    \n\
   void main()                      \n\
   {                                \n\
      gl_FragColor = fColor;        \n\
   }                                \n\
";

function initShaders( gl, vertexShader, fragmentShader )
{
   var vertShdr;
   var fragShdr;

   vertShdr = gl.createShader( gl.VERTEX_SHADER );
   gl.shaderSource( vertShdr, vertexShader );
   gl.compileShader( vertShdr );
   if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
      var msg = "Vertex shader failed to compile.  The error log is:"
   + "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
      alert( msg );
      return -1;
   }

   fragShdr = gl.createShader( gl.FRAGMENT_SHADER );
   gl.shaderSource( fragShdr, fragmentShader );
   gl.compileShader( fragShdr );
   if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
      var msg = "Fragment shader failed to compile.  The error log is:"
   + "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
      alert( msg );
      return -1;
   }

   var program = gl.createProgram();
   gl.attachShader( program, vertShdr );
   gl.attachShader( program, fragShdr );
   gl.linkProgram( program );
    
   if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
      var msg = "Shader program failed to link.  The error log is:"
         + "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
      alert( msg );
      return -1;
   }

   return program;
}
