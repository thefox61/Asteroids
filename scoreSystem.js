
import { theGame } from "./main.js";
import { dynamicGameObject } from "./gameObject.js";

export class scoreSystem
{
    baseScores = {
        "largeAsteroid": 20,
        "mediumAsteroid": 50,
        "smallAsteroid": 100,
        "largeSaucer": 200,
        "smallSaucer": 1000
    }

    collisionScores = 
    {
        "playerBullet_largeAsteroid": this.baseScores["largeAsteroid"],
        "playerBullet_mediumAsteroid": this.baseScores["mediumAsteroid"],
        "playerBullet_smallAsteroid": this.baseScores["smallAsteroid"],
        "largeAsteroid_playerBullet": this.baseScores["largeAsteroid"],
        "mediumAsteroid_playerBullet": this.baseScores["mediumAsteroid"],
        "smallAsteroid_playerBullet": this.baseScores["smallAsteroid"],

        "playerBullet_largeSaucer": this.baseScores["largeSaucer"],
        "playerBullet_smallSaucer": this.baseScores["smallSaucer"],
        "largeSaucer_playerBullet": this.baseScores["largeSaucer"],
        "smallSaucer_playerBullet": this.baseScores["smallSaucer"],
    };


    scoreGameObject;

    score = 0;
    lives = 3;

    constructor()
    {

    }

    init()
    {
        this.scoreGameObject = new dynamicGameObject();

        let scoreMesh = theGame.textRender.generateTextMesh(this.score.toString());

        theGame.render.loadMeshBuffers(scoreMesh);
        theGame.render.loadUniformLocations(scoreMesh);

        this.scoreGameObject.mesh = scoreMesh;

        const boundaries = theGame.physics.boundaries;
        const lengthX = boundaries[2] - boundaries[0];
        const lengthY = boundaries[3] - boundaries[1];

        const x = (lengthX * 0.1) + boundaries[0];
        const y = (lengthY * 0.97) + boundaries[1];

        this.scoreGameObject.position = vec3.fromValues(x, y, -6.1);
        this.scoreGameObject.rotation = vec3.fromValues(3.14, 0.0, 0.0);
        this.scoreGameObject.scale = vec3.fromValues(0.01, 0.01, 0.01);

        theGame.gameObjects.push(this.scoreGameObject);
    }

    updateScore()
    {
     
        let updated = false;
        const numCollisions = theGame.physics.numCollisionsThisFrame;

        for(let i = 0; i < numCollisions; i++)
        {
            
            let currCollision = theGame.physics.collisionsThisFrame[i];

            const collisionName = `${theGame.gameObjects[currCollision.objectA].type}_${ theGame.gameObjects[currCollision.objectB].type}`;

            const collisionScore = this.collisionScores[collisionName];

            if(collisionScore)
            {
                this.score += collisionScore;
                updated = true;
            }
        }

        if(updated)
        {
            theGame.textRender.updateTextMesh(this.scoreGameObject.mesh, this.score.toString());

            theGame.render.updateMeshBuffers(this.scoreGameObject.mesh);
        }


    }

    reset()
    {

    }

}