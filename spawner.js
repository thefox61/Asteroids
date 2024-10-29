import { getRandomLocation, getRandomVelocity, getRandDirection} from "./utilityFunctions.js";
import { level } from "./level.js";
import { theGame } from "./main.js";
import { objectPools } from "./objectPools.js";

export class spawner
{
    objectPool;


    spawnsRemaining = 0;


    constructor()
    {


    }

    initSpawner()
    {
        this.objectPool = new objectPools();
        this.objectPool.initPools(100, 0, 10);
    }

    update(deltaTime)
    {
        this.checkCollisions();
    }

    initLevel()
    {
        const levelParams = theGame.levelParams;
        // spawn starting asteroids and ships
        for(let i = 0; i < levelParams.numAsteroids; i++)
        {
            this.spawnAsteroid();
        }

        // update spawns remaining
        this.spawnsRemaining = (levelParams.numAsteroids + levelParams.numShips) 
                                - (levelParams.startingAsteroids + levelParams.startingShips);

    }

    checkCollisions()
    {
        const numCollisions = theGame.physics.numCollisionsThisFrame;

        for(let i = 0; i < numCollisions; i++)
        {
            
            let currCollision = theGame.physics.collisionsThisFrame[i];

            

            console.log("collision being processed in spawner!", theGame.gameObjects[currCollision.objectA].type, theGame.gameObjects[currCollision.objectB].type );

            if(theGame.gameObjects[currCollision.objectA].type === "playerBullet")
            {
                if (!(theGame.gameObjects[currCollision.objectB].type === "player"))
                {
                    this.despawnBullet(theGame.gameObjects[currCollision.objectA]);
                }
                
            }
            else if (theGame.gameObjects[currCollision.objectA].type === "largeAsteroid")
            {
                this.despawnAsteroid(theGame.gameObjects[currCollision.objectA]);
            }
            else if (theGame.gameObjects[currCollision.objectA].type === "player")
            {
                    
            }

            if(theGame.gameObjects[currCollision.objectB].type === "playerBullet")
            {
                if (!(theGame.gameObjects[currCollision.objectA].type === "player"))
                {
                    this.despawnBullet(theGame.gameObjects[currCollision.objectB]);
                }
               
            }
            else if (theGame.gameObjects[currCollision.objectB].type === "largeAsteroid")
            {
                this.despawnAsteroid(theGame.gameObjects[currCollision.objectB]);
            }
            else if (theGame.gameObjects[currCollision.objectB].type === "player")
            {
                    
            }
        }


    }

    spawnAsteroid()
    {
        let newAsteroid = this.objectPool.getAsteroid();

        newAsteroid.gameObject.position = getRandomLocation();
 
        if(newAsteroid.gameObject.isActive)
        {
            theGame.gameObjects.push(newAsteroid.gameObject);
        }
        else
        {
            newAsteroid.gameObject.isActive = true;
        }

        let velocity = vec3.create();
        vec3.scale(velocity, getRandomVelocity(), 0.1);
        newAsteroid.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        newAsteroid.gameObject.physics.velocity = velocity;
        newAsteroid.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);
        newAsteroid.gameObject.physics.diameter = 0.08;

    }

    despawnAsteroid(theAsteroid)
    {
        theAsteroid.isActive = false;

        //this.objectPool.returnAsteroid(theAsteroid);
    }

    spawnShip()
    {

    }

    spawnBullet(position, direction)
    {
        let newBullet = this.objectPool.getBullet();

        newBullet.gameObject.position = position;

        if(newBullet.gameObject.isActive)
        {
            theGame.gameObjects.push(newBullet.gameObject);
        }
        else
        {
            newBullet.gameObject.isActive = true;
        }

        newBullet.gameObject.scale = vec3.fromValues(0.03, 0.03, 0.03);
        newBullet.gameObject.physics.velocity = vec3.scale(direction, direction, 2.0);
        newBullet.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);
        newBullet.gameObject.physics.diameter = 0.03;
    }

    despawnBullet(theBullet)
    {
        theBullet.isActive = false;
        //this.objectPool.returnBullet(theBullet);
    }

    
}

