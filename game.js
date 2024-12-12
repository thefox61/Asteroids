import { player } from "./player.js";
import { loadPLY } from "./plyLoader.js";
import { renderer } from "./render.js";
import { physics } from "./physics.js";
import { dynamicGameObject } from "./gameObject.js";
import { spawner } from "./spawner.js";
import { level } from "./level.js";
import { updateSaucers } from "./saucerUpdate.js";
import { textureManager } from "./textureManager.js";
import { textRenderer } from "./textRendering.js";
import { fontInfo, fontSource } from "./font.js";
import { scoreSystem } from "./scoreSystem.js";
import { audioSystem } from "./audioSystem.js";
import { levelManager } from "./levelManager.js";


// this seems questionable -- but working on figuring out the best solution
// 'this.' is undefined in gameUpdate due to how it's called
import { theGame } from "./main.js";

export class game
{
    gameState;

    player;
    spawnPosition;

    levelParams;


    deltaTime = 0.0;
    prevFrame = 0.0;
    
    playerMesh;
    asteroidMesh;
    bulletMesh;
    saucerMesh;

    render;
    physics;
    spawner;
    texturer;
    textRender;
    scorer;
    audio;
    levelSystem;

    gameObjects = [];

    isRunning = false;
    isEnd = false;

    constructor()
    {
        this.spawnPosition = vec3.fromValues(0.0, 0.0, -6.0);
    }

    async init()
    {
        this.player = new player();
        this.player.gameObject = new dynamicGameObject();
        this.player.gameObject.type = "player";
        this.player.gameObject.position = vec3.fromValues(0.0, 0.0, -6.0);
        this.player.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        this.player.gameObject.physics.dampening = vec3.fromValues(0.3, 0.3, 0.3);
        this.player.gameObject.physics.diameter = 0.12;

        await this.loadMeshes();

        this.render = new renderer();
        this.render.initRender();

        this.texturer = new textureManager();

        this.render.loadMeshBuffers(this.playerMesh);
        this.render.loadUniformLocations(this.playerMesh);

        

        this.render.loadMeshBuffers(this.asteroidMesh);
        this.render.loadUniformLocations(this.asteroidMesh);

        this.render.loadMeshBuffers(this.bulletMesh);
        this.render.loadUniformLocations(this.bulletMesh);

        this.render.loadMeshBuffers(this.saucerMesh);
        this.render.loadUniformLocations(this.saucerMesh);


        this.player.gameObject.mesh = this.playerMesh;

        let playerTexture = await this.texturer.loadTexture("./textures/space_ship_test_color.png");
        this.player.gameObject.mesh.texture = playerTexture;
        this.player.gameObject.mesh.bHasTexture = true;

        
        this.gameObjects.push(this.player.gameObject);

        this.textRender = new textRenderer();

        await this.textRender.init(fontSource, fontInfo);

        let boundaries = this.render.calculateScreenBoundaries(6.0);

        this.physics = new physics(boundaries);

        this.scorer = new scoreSystem();
        this.scorer.init();

        this.spawner = new spawner();

        this.spawner.initSpawner();

        this.audio = new audioSystem();
        this.audio.init();

        this.levelSystem = new levelManager();
        this.levelSystem.init();


        this.spawner.initLevel();

        this.runGame();
    }

    async loadMeshes()
    {
        this.playerMesh = await loadPLY("./models/spaceship.ply");
        this.asteroidMesh = await loadPLY("./models/PS1_style_low poly asteroids.ply");
        this.bulletMesh = await loadPLY("./models/bullet1.ply");
        this.saucerMesh = await loadPLY("./models/saucer.ply");
    }

    gameUpdate(now) {
        now *= 0.001; // convert to seconds
        theGame.deltaTime = now - theGame.prevFrame;
        theGame.prevFrame = now;

        theGame.render.renderGameObjects(theGame.gameObjects);
        if(theGame.isRunning)
        {
            theGame.physics.updateMovement(theGame.gameObjects, theGame.deltaTime);
            theGame.physics.checkCollisions(theGame.gameObjects);
            theGame.spawner.update(theGame.deltaTime);
            theGame.scorer.updateScore();
            theGame.levelSystem.checkFinished();
            updateSaucers(theGame.deltaTime);
        }

        if(theGame.isEnd)
        {
            theGame.restartGame();
        }
          
        requestAnimationFrame(theGame.gameUpdate, theGame);  
        
    }

    runGame()
    {   
        requestAnimationFrame(theGame.gameUpdate);
    }

    restartGame()
    {
        
        // move player back to center
        this.player.gameObject.position = vec3.fromValues(0.0, 0.0, -6.0);
        this.player.gameObject.physics.velocity = vec3.fromValues(0.0, 0.0, 0.0);
        this.player.gameObject.physics.acceleration = vec3.fromValues(0.0, 0.0, 0.0);

        // clear all gameObjects (objectPools can remain though?)
        this.gameObjects.length = 0;
        this.gameObjects.push(this.player.gameObject);

        // reset score
        this.isEnd = false;

        this.scorer.reset();
        this.audio.pauseAll();

        this.levelSystem.reset();
        this.spawner.initSpawner();
        this.spawner.initLevel();
    }
   


}