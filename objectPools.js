import { dynamicGameObject } from "./gameObject.js";
import { asteroid } from "./asteroid.js";
import { bullet } from "./bullet.js"
import { theGame } from "./main.js";
import { saucer } from "./saucer.js";

export class objectPools
{
    asteroids = [];
    freeAsteroids = [];
    numFreeAsteroids = 0;

    saucers = [];
    freeSaucers = [];
    numFreeSaucers = 0;

    bullets = [];
    freeBullets = [];
    numFreeBullets = 0;

    constructor()
    {


    }

    initPools(asteroidsSize, saucersSize, bulletsSize)
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

            this.asteroids[i].gameObject.index = i;

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

            this.bullets[i].gameObject.index = i;

            this.freeBullets[i] = i;

            this.bullets[i].id = i;

            this.bullets[i].lifetime = 0.0;
        }

        this.numFreeSaucers = saucersSize;

        this.saucers.length = saucersSize;
        this.freeSaucers.length = saucersSize;

        for(let i = 0; i < saucersSize; i++)
        {
            this.saucers[i] = new saucer();

            this.saucers[i].gameObject = new dynamicGameObject();

            this.saucers[i].gameObject.mesh = theGame.saucerMesh;

            this.saucers[i].gameObject.isActive = true;

            this.saucers[i].gameObject.type = "largeSaucer";

            this.saucers[i].gameObject.index = i;

            this.freeSaucers[i] = i;
        }

    }

    getAsteroid()
    {
        if(this.numFreeAsteroids - 1 < 0)
        { 
            return null;
        }

        this.numFreeAsteroids--;

        let asteroidIndex = this.freeAsteroids[this.numFreeAsteroids];

        return this.asteroids[asteroidIndex];
    }

    returnAsteroid(asteroidIndex)
    {
        this.freeAsteroids[this.numFreeAsteroids] = asteroidIndex;
        
        this.numFreeAsteroids++;
    }

    getBullet()
    {
        if(this.numFreeBullets - 1 < 0)
        { 
            return null;
        }

        this.numFreeBullets--;
        
        let bulletIndex = this.freeBullets[this.numFreeBullets];

        return this.bullets[bulletIndex];
    }

    returnBullet(bulletIndex)
    {
        this.freeBullets[this.numFreeBullets] = bulletIndex;

        this.numFreeBullets++;
    }

    getSaucer()
    {
        if(this.numFreeSaucers - 1 < 0)
        { 
            return null;
        }

        this.numFreeSaucers--;

        let saucerIndex = this.freeSaucers[this.numFreeSaucers];

        return this.saucers[saucerIndex];
    }

    returnSaucer(saucerIndex)
    {
        this.freeSaucers[this.numFreeSaucers] = saucerIndex;
        
        this.numFreeSaucers++;
    }

}