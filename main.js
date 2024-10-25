
import {loadPLY } from "./plyLoader.js";
import {mesh, vertex} from "./mesh.js"
import { staticGameObject } from "./gameObject.js";
import {renderer} from "./render.js"

// python -m http.server

main();


async function main()
{
    
    // let asteroidMesh = loadPLY("PS1_style_low poly asteroids.ply");

    let asteroid = new staticGameObject();





    asteroid.mesh = await loadPLY("spaceship.ply");
    console.log(asteroid.mesh.vertices);
    // console.log(aMesh.vertexBufferID);

    asteroid.position = vec3.create();

    asteroid.position[0] = 0.0;
    asteroid.position[1] = 0.0;
    asteroid.position[2] = -6.0;

    asteroid.rotation = vec3.create();
    asteroid.rotation[0] = 1.0;

    

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

    let theRenderer = new renderer();

    theRenderer.initRender(vsSource, fsSource);

    theRenderer.loadMeshBuffers(asteroid.mesh);

    theRenderer.loadUniformLocations(asteroid.mesh);

    theRenderer.renderGameObjects(asteroid);
    

}