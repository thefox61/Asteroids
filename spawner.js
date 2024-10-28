import { getRandomLocation, getRandomVelocity } from "./utilityFunctions.js";
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
        this.objectPool.initPools(100, 0, 0);
    }

    update(deltaTime)
    {


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

    spawnAsteroid()
    {
        let newAsteroid = this.objectPool.getAsteroid();

        newAsteroid.gameObject.position = getRandomLocation();
 
        if(newAsteroid.gameObject.isActive)
        {
            theGame.gameObjects.push(newAsteroid.gameObject);
        }

        newAsteroid.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        newAsteroid.gameObject.physics.velocity = getRandomVelocity();
        newAsteroid.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);

    }

    spawnShip()
    {

    }

    
}

