import { dynamicGameObject } from "./gameObject.js";
import { asteroid } from "./asteroid.js";
import { theGame } from "./main.js";

class objectPools
{
    asteroids = [];
    freeAsteroids = [];
    numFreeAsteroids = 0;

    activeShips = [];
    freeShips = [];

    activeBullets = [];
    freeBullets = [];

    constructor()
    {


    }

    initPools(asteroidsSize, shipsSize, bulletsSize)
    {
        this.numFreeAsteroids = asteroidsSize;

        this.asteroids.length = asteroidsSize;
        this.freeAsteroids.length = asteroidsSize;

        for(let i = 0; i < asteroidsSize; i++)
        {
            asteroids[i] = new asteroid();

            asteroids[i].type = "large";

            asteroids[i].gameObject = new dynamicGameObject();

            asteroids[i].gameObject.mesh = theGame.asteroidMesh;
            
            asteroids[i].gameObject.isActive = false;

            this.freeAsteroids[i] = i;

            asteroids[i].id = i;
        }

    }

    getAsteroid()
    {
        if(this.numFreeAsteroids - 1 <= 0)
        { 
            return null;
        }

        this.numFreeAsteroids--;

        return this.freeAsteroids[this.numFreeAsteroids];
    }

    returnAsteroid(theAsteroid)
    {
        this.freeAsteroids[this.numFreeAsteroids] = theAsteroid.id;


        this.numFreeAsteroids++;
    }


}