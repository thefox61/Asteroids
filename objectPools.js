import { dynamicGameObject } from "./gameObject.js";
import { asteroid } from "./asteroid.js";
import { theGame } from "./main.js";

export class objectPools
{
    asteroids = [];
    freeAsteroids = [];
    numFreeAsteroids = 0;

    ships = [];
    freeShips = [];
    numFreeShips = 0;

    bullets = [];
    freeBullets = [];
    numFreeBullets = 0;

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
            this.asteroids[i] = new asteroid();

            this.asteroids[i].type = "large";

            this.asteroids[i].gameObject = new dynamicGameObject();

            this.asteroids[i].gameObject.mesh = theGame.asteroidMesh;
       
            this.asteroids[i].gameObject.isActive = true;

            this.freeAsteroids[i] = i;

            this.asteroids[i].id = i;
        }

        // this.numFreeShips = shipsSize;

        // this.ships.length = shipsSize;
        // this.freeShips.length = shipsSize;

        // for(let i = 0; i < shipsSize; i++)
        // {
        //     this.ships[i] = new spaceship();

        //     this.ships[i].type = "large";

        //     this.ships[i].gameObject = new dynamicGameObject();

        //     this.ships[i].gameObject.mesh = theGame.asteroidMesh;
         
        //     this.ships[i].gameObject.isActive = false;

        //     this.freeShips[i] = i;

        //     this.ships[i].id = i;
        // }

        // this.numFreeBullets = bulletsSize;

        // this.bullets.length = bulletsSize;
        // this.freeBullets.length = bulletsSize;

        // for(let i = 0; i < bulletsSize; i++)
        // {
        //     this
        // }

    }

    getAsteroid()
    {
        if(this.numFreeAsteroids - 1 <= 0)
        { 
            return null;
        }

        this.numFreeAsteroids--;

        return this.asteroids[this.numFreeAsteroids];
    }

    returnAsteroid(theAsteroid)
    {
        this.freeAsteroids[this.numFreeAsteroids] = theAsteroid.id;

        this.numFreeAsteroids++;
    }


}