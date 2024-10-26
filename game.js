import { player } from "./player.js";
import { loadPLY } from "./plyLoader.js";
import { renderer } from "./render.js";
import { physics } from "./physics.js";
import { dynamicGameObject } from "./gameObject.js";

// this seems questionable -- but working on figuring out the best solution
// this. is undefined in game update due to how it's called
import { theGame } from "./main.js";

export class game
{
    gameState;
    player;
    spawnPosition;
    deltaTime = 0.0;
    prevFrame = 0.0;
    
    playerMesh;
    asteroidMesh;

    render;
    physics;

    gameObjects = [];

    constructor()
    {
        this.spawnPosition = vec3.fromValues(0.0, 0.0, -6.0);
    }

    async init()
    {
        this.player = new player();
        this.player.gameObject = new dynamicGameObject();
        this.player.gameObject.position = vec3.fromValues(0.0, 0.0, -6.0);
        this.player.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        this.player.gameObject.physics.dampening = vec3.fromValues(0.99, 0.99, 0.99);
        await this.loadMeshes();

        this.render = new renderer();
        this.render.initRender();

        this.render.loadMeshBuffers(this.playerMesh);
        this.render.loadUniformLocations(this.playerMesh);

        // this.render.loadMeshBuffers(this.asteroidMesh);
        // this.render.loadUniformLocations(this.asteroidMesh);

        // this just creates a reference, right?
        // I miss C++
        this.player.gameObject.mesh = this.playerMesh;

        this.gameObjects.push(this.player.gameObject);

        let boundaries = this.render.calculateScreenBoundaries(6.0);

        this.physics = new physics(boundaries);
        

        this.runGame();
    }

    async loadMeshes()
    {
        this.playerMesh = await loadPLY("spaceship.ply");
        // this.asteroidMesh = await loadPLY("PS1_style_low poly asteroids.ply");
    }

    gameUpdate(now) {
        now *= 0.001; // convert to seconds
        theGame.deltaTime = now - theGame.prevFrame;
        theGame.prevFrame = now;

        theGame.render.renderGameObjects(theGame.gameObjects);
        theGame.physics.updateMovement(theGame.gameObjects, theGame.deltaTime);
        theGame.physics.checkCollisions(theGame.gameObjects);
        requestAnimationFrame(theGame.gameUpdate, theGame);
    }

    runGame()
    {   
        requestAnimationFrame(theGame.gameUpdate);
    }

   


}