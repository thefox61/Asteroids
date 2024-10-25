
import {loadPLY } from "./plyLoader.js";
import {mesh, vertex} from "./mesh.js";
import { dynamicGameObject, staticGameObject } from "./gameObject.js";
import {renderer} from "./render.js"

import { physicsComponent } from "./physicsComponent.js";
import { physics } from "./physics.js";

// python -m http.server

main();


async function main()
{
    
    // let asteroidMesh = loadPLY("PS1_style_low poly asteroids.ply");

    let asteroid = new dynamicGameObject();

    let deltaTime = 0;

    asteroid.mesh = await loadPLY("spaceship.ply");
    console.log(asteroid.mesh.vertices);
    // console.log(aMesh.vertexBufferID);

    asteroid.position = vec3.create();

    asteroid.position[0] = 0.0;
    asteroid.position[1] = 0.0;
    asteroid.position[2] = -6.0;

    asteroid.rotation = vec3.create();
    asteroid.rotation[0] = 1.0;

    asteroid.scale[0] = 0.05;
    asteroid.scale[1] = 0.05;
    asteroid.scale[2] = 0.05;

    asteroid.physics = new physicsComponent();

    asteroid.physics.velocity[0] = 0.0;
    asteroid.physics.velocity[1] = 2.0;
    asteroid.physics.velocity[2] = 0.0;

    asteroid.physics.acceleration[0] = 1.0;
    asteroid.physics.acceleration[1] = 1.0;
    asteroid.physics.acceleration[2] = 1.0;

    asteroid.physics.dampening[0] = 1.0;
    asteroid.physics.dampening[1] = 1.0;
    asteroid.physics.dampening[2] = 1.0;

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

    let thePhysics = new physics();

    theRenderer.initRender(vsSource, fsSource);

    theRenderer.loadMeshBuffers(asteroid.mesh);

    theRenderer.loadUniformLocations(asteroid.mesh);

    theRenderer.renderGameObjects(asteroid);

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
        requestAnimationFrame(gameUpdate);
    }

    requestAnimationFrame(gameUpdate);
}