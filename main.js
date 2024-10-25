
import {loadPLY } from "./plyLoader.js";
import {mesh, vertex} from "./mesh.js";
import { dynamicGameObject, staticGameObject } from "./gameObject.js";
import {renderer} from "./render.js"

import { physicsComponent } from "./physicsComponent.js";
import { physics } from "./physics.js";

// python -m http.server
let asteroid = new dynamicGameObject();

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "w":
      // code for "down arrow" key press.

      let matRotation = mat4.create();

      mat4.rotate(
        matRotation, 
        matRotation, 
        asteroid.rotation[0], 
        [1,0,0],
      ); 
      mat4.rotate(
          matRotation, 
          matRotation, 
          asteroid.rotation[1], 
          [0,1,0],
      ); 
      mat4.rotate(
          matRotation, 
          matRotation, 
          asteroid.rotation[2], 
          [0,0,1],
      ); 


      let direction = vec4.create();
      direction[1] = 1.0;

      vec4.transformMat4(direction,direction, matRotation);

      vec3.scale(asteroid.physics.acceleration, vec3.fromValues(direction[0], direction[1], direction[2]), 0.05);
      console.log(direction);
      //asteroid.physics.acceleration = 0.5;
      break;
    case "a":
      // code for "up arrow" key press.
      asteroid.rotation[2] += 0.2;
      break;
    case "d":
      // code for "left arrow" key press.
      asteroid.rotation[2] -= 0.2;
      break;
    default:
      console.log(event.key);
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }

  switch (event.key) {
    case "w":
      // code for "down arrow" key press.

      vec3.set(asteroid.physics.acceleration, 0.0, 0.0, 0.0);
      break;

    default:
      //console.log(event.key);
      return; // Quit when this doesn't handle the key event.
  }

  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);

main();


async function main()
{
    
    // let asteroidMesh = loadPLY("PS1_style_low poly asteroids.ply");

    

    let deltaTime = 0;

    asteroid.mesh = await loadPLY("spaceship.ply");
    console.log(asteroid.mesh.vertices);
    // console.log(aMesh.vertexBufferID);

    asteroid.position = vec3.create();

    // -44.18278121948242 -24.852811813354492 60 -0.6000137329101562
    asteroid.position[0] = 0.0;
    asteroid.position[1] = 0.0;
    asteroid.position[2] = -6.0;

    asteroid.rotation = vec3.create();
   

    asteroid.scale[0] = 0.05;
    asteroid.scale[1] = 0.05;
    asteroid.scale[2] = 0.05;

    asteroid.physics = new physicsComponent();

    asteroid.physics.velocity[0] = 0.0;
    asteroid.physics.velocity[1] = 0.0;
    asteroid.physics.velocity[2] = 0.0;

    asteroid.physics.acceleration[0] = 0.0;
    asteroid.physics.acceleration[1] = 0.0;
    asteroid.physics.acceleration[2] = 0.0;

    asteroid.physics.dampening[0] = 0.99;
    asteroid.physics.dampening[1] = 0.99;
    asteroid.physics.dampening[2] = 0.99;

    let gameObjects = [asteroid];
  
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

    let boundaries = theRenderer.calculateScreenBoundaries(6.0);

    let thePhysics = new physics(boundaries);
    // theRenderer.renderGameObjects(asteroid);
    // Draw the scene
    let then = 0;

    // Draw the scene repeatedly
    function gameUpdate(now) {
        now *= 0.001; // convert to seconds
        deltaTime = now - then;
        then = now;

        theRenderer.renderGameObjects(asteroid);
        thePhysics.updateMovement(gameObjects, deltaTime);
        thePhysics.checkCollisions(gameObjects);
        requestAnimationFrame(gameUpdate);
    }

    requestAnimationFrame(gameUpdate);
}