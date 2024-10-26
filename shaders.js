const vsSource = `
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec4 aVertexNormal;
attribute vec4 aVertexPosition;
attribute vec4 aVertexTexCoords;



void main(void) {
vec4 doesNOthing = aVertexNormal * aVertexTexCoords;
doesNOthing = doesNOthing * vec4(0.0, 0.0, 0.0, 0.0);


gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}`;


// Fragment shader program
const fsSource = `
void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);    
}`;

export {vsSource, fsSource};