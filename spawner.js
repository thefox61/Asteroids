import { getRandomLocation, getRandomVelocity, getRandDirection} from "./utilityFunctions.js";
import { level } from "./level.js";
import { theGame } from "./main.js";
import { objectPools } from "./objectPools.js";



export class spawner
{
    objectPool;


    spawnsRemaining = 0;

    largeAsteroidScale = vec3.fromValues(0.1, 0.1, 0.1) ;
    mediumAsteroidScale = vec3.fromValues(0.05, 0.05, 0.05);
    smallAsteroidScale = vec3.fromValues(0.02, 0.02, 0.02);

    // collision handler functions
    
    collisionHandlers = 
    {
        "player_largeAsteroid": this.handlePlayerAsteroidCollision,
        "player_mediumAsteroid": this.handlePlayerAsteroidCollision,
        "player_smallAsteroid": this.handlePlayerAsteroidCollision,
        "largeAsteroid_player": this.handlePlayerAsteroidCollision,
        "mediumAsteroid_player": this.handlePlayerAsteroidCollision,
        "smallAsteroid_player": this.handlePlayerAsteroidCollision,
        "playerBullet_largeAsteroid": this.handleBulletAsteroidCollision,
        "playerBullet_mediumAsteroid": this.handleBulletAsteroidCollision,
        "playerBullet_smallAsteroid": this.handleBulletAsteroidCollision,
        "largeAsteroid_playerBullet": this.handleBulletAsteroidCollision,
        "mediumAsteroid_playerBullet": this.handleBulletAsteroidCollision,
        "smallAsteroid_playerBullet": this.handleBulletAsteroidCollision
    };


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
        this.updateBullets(deltaTime);
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

    updateBullets(deltaTime)
    {
        let bullets = this.objectPool.bullets;

        // get bullets from object pool
        for(let i = 0; i < bullets.length; i++)
        {
            let currBullet = bullets[i];
            if(!currBullet.gameObject.isActive || currBullet.lifetime <= 0.0)
            {
                continue;
            }

            currBullet.lifetime -= deltaTime;

            if(currBullet.lifetime <= 0.0)
            {
                this.despawnBullet(currBullet.gameObject);
            }
                    
        }
    }

    checkCollisions()
    {
        const numCollisions = theGame.physics.numCollisionsThisFrame;

        for(let i = 0; i < numCollisions; i++)
        {
            
            let currCollision = theGame.physics.collisionsThisFrame[i];

            const collisionName = `${theGame.gameObjects[currCollision.objectA].type}_${ theGame.gameObjects[currCollision.objectB].type}`;

            const collisionHandler = this.collisionHandlers[collisionName];

            if(collisionHandler)
            {
                collisionHandler(theGame.gameObjects[currCollision.objectA], theGame.gameObjects[currCollision.objectB]);
            }
        }


    }

    handlePlayerAsteroidCollision(objectA, objectB)
    {
        console.log("player asteroid handler called");
        let player = objectA.type === "player" ? objectA : objectB;

        let asteroid; 
        if(objectA.type === "largeAsteroid" || objectA.type === "mediumAsteroid" || objectA.type === "smallAsteroid")
        {
            asteroid = objectA;
        }
        else
        {
            asteroid = objectB;
        }

        theGame.spawner.despawnAsteroid(asteroid);

    }

    handleBulletAsteroidCollision(objectA, objectB)
    {
        console.log("playerBullet asteroid handler called");
        let bullet = objectA.type === "playerBullet" ? objectA : objectB;

        let asteroid; 
        if(objectA.type === "largeAsteroid" || objectA.type === "mediumAsteroid" || objectA.type === "smallAsteroid")
        {
            asteroid = objectA;
        }
        else
        {
            asteroid = objectB;
        }

        theGame.spawner.despawnAsteroid(asteroid);
        theGame.spawner.despawnBullet(bullet);
    }

    spawnAsteroid(asteroidType)
    {
        let newAsteroid = this.objectPool.getAsteroid();

        if(newAsteroid == null)
        {
            console.log("no asteroids available to spawn");
            return;
        }

        newAsteroid.gameObject.position = getRandomLocation();
 
        if(newAsteroid.gameObject.isActive)
        {
            theGame.gameObjects.push(newAsteroid.gameObject);
        }
        else
        {
            newAsteroid.gameObject.isActive = true;1
        }

        

        let velocity = vec3.create();
        vec3.scale(velocity, getRandomVelocity(), 0.1);
        newAsteroid.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        newAsteroid.gameObject.physics.velocity = velocity;
        newAsteroid.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);
        newAsteroid.gameObject.physics.diameter = 0.08;

        // 3.17 is max dimension of unscaled asteroid mesh
        switch(asteroidType){
            case "largeAsteroid":
                vec3.copy(newAsteroid.gameObject.scale, this.largeAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.largeAsteroidScale[0]) / 2.0;
                newAsteroid.gameObject.type = "largeAsteroid";
                break;
            case "mediumAsteroid":
                vec3.copy(newAsteroid.gameObject.scale, this.mediumAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.mediumAsteroidScale[0]) / 2.0;
                newAsteroid.gameObject.type = "mediumAsteroid";
                break;

            case "smallAsteroid":
                vec3.copy(newAsteroid.gameObject.scale, this.smallAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.smallAsteroidScale[0]) / 2.0;
                newAsteroid.gameObject.type = "smallAsteroid";
                break;
            default:
                vec3.copy(newAsteroid.gameObject.scale, this.largeAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.largeAsteroidScale[0]) / 2.0;
                newAsteroid.gameObject.type = "largeAsteroid";
                break;
        }

        return newAsteroid;
    }

    despawnAsteroid(theAsteroid)
    {
        // check if this astero"id needs to be split
        if(theAsteroid.type == "largeAsteroid")
        {
            // spawn two new asteroids
           
            let asteroid1 = this.spawnAsteroid("mediumAsteroid");
            let asteroid2 = this.spawnAsteroid("mediumAsteroid");

            vec3.copy(asteroid1.gameObject.position, theAsteroid.position);
            vec3.copy(asteroid2.gameObject.position, theAsteroid.position);    

        }
        else if(theAsteroid.type == "mediumAsteroid")
        {
            let asteroid1 = this.spawnAsteroid("smallAsteroid");
            let asteroid2 = this.spawnAsteroid("smallAsteroid");

            
            vec3.copy(asteroid1.gameObject.position, theAsteroid.position);
            vec3.copy(asteroid2.gameObject.position, theAsteroid.position);    
        }


        theAsteroid.isActive = false;

        this.objectPool.returnAsteroid(theAsteroid.index);
    }

    spawnShip()
    {

    }

    spawnBullet(position, direction)
    {
        let newBullet = this.objectPool.getBullet();

        if(newBullet == null)
        {
            console.log("no bullets available to spawn");
            return;
        }
        
        newBullet.lifetime = 3.0;

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
        this.objectPool.returnBullet(theBullet.index);
    }

    
}

