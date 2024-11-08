const vsSource = `
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec4 aVertexNormal;
attribute vec4 aVertexPosition;
attribute vec2 aVertexTexCoords;

varying highp vec2 vTextureCoord;

void main(void) {
vec4 doesNOthing = aVertexNormal * vec4(1.0, 2.0, 3.0, 4.0);
doesNOthing = doesNOthing * vec4(0.0, 0.0, 0.0, 0.0); 


gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
vTextureCoord = aVertexTexCoords;
}`;


// Fragment shader program
const fsSource = `precision mediump float;
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform bool bHasTexture;

void main(void) {
  vec4 frag_colour;
  if(bHasTexture)
  {
    frag_colour = texture2D(uSampler, vTextureCoord); 
  } 
  else
  {
    frag_colour = vec4(1.0, 1.0, 1.0, 1.0);  
  }

  gl_FragColor = frag_colour;
    
}`;

export {vsSource, fsSource};


/*
`
varying highp vec2 vTextureCoord;

uniform sampler2D uSampler;


uniform bool bHasTexture;

void main(void) {
  if(bHasTexture)
  {
    gl_FragColor = texture(uSampler, vTextureCoord); 
  } 
  else
  {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);  
  }
    
}`;
*/