import { dynamicGameObject } from "./gameObject.js";
import { asteroid } from "./asteroid.js";
import { bullet } from "./bullet.js"
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

            this.asteroids[i].gameObject.type = "largeAsteroid";

            this.freeAsteroids[i] = i;

            this.asteroids[i].id = i;
        }

        this.numFreeBullets = bulletsSize;

        this.bullets.length = bulletsSize;
        this.freeBullets.length = bulletsSize;

        for(let i = 0; i < bulletsSize; i++)
        {
            this.bullets[i] = new bullet();

            this.bullets[i].gameObject = new dynamicGameObject();

            this.bullets[i].gameObject.mesh = theGame.bulletMesh;

            this.bullets[i].gameObject.isActive = true;

            this.bullets[i].gameObject.type = "playerBullet";

            this.freeBullets[i] = i;

            this.bullets[i].id = i;
        }

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

    getBullet()
    {
        if(this.numFreeBullets - 1 <= 0)
        { 
            return null;
        }

        this.numFreeBullets--;

        return this.bullets[this.numFreeBullets];
    }

    returnBullet(theBullet)
    {
        this.freeBullets[this.numFreeBullets] = theBullet.id;

        this.numFreeBullets++;
    }

}