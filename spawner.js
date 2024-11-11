import { getRandomLocation, getRandomVelocity, getRandDirection} from "./utilityFunctions.js";
import { level } from "./level.js";
import { theGame } from "./main.js";
import { objectPools } from "./objectPools.js";



export class spawner
{
    objectPool;


    

    largeAsteroidScale = vec3.fromValues(0.15, 0.15, 0.15);
    mediumAsteroidScale = vec3.fromValues(0.1, 0.1, 0.1);
    smallAsteroidScale = vec3.fromValues(0.05, 0.05, 0.05);

    lastAsteroidSpawn;
    lastSaucerSpawn;

    asteroidSpawnsRemaining = 0;
    saucerSpawnsRemaining = 0;

    activeAsteroids = 0;
    activeSaucers = 0;

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
        "smallAsteroid_playerBullet": this.handleBulletAsteroidCollision,

        "playerBullet_largeSaucer": this.handleBulletSaucerCollision,
        "playerBullet_smallSaucer": this.handleBulletSaucerCollision,
        "largeSaucer_playerBullet": this.handleBulletSaucerCollision,
        "smallSaucer_playerBullet": this.handleBulletSaucerCollision,

        "saucerBullet_player": this.handlePlayerSaucerBulletCollision,
        "player_saucerBullet": this.handlePlayerSaucerBulletCollision,

        "player_largeSaucer": this.handlePlayerSaucerCollision,
        "player_smallSaucer": this.handlePlayerSaucerCollision,
        "largeSaucer_player": this.handlePlayerSaucerCollision,
        "smallSaucer_player": this.handlePlayerSaucerCollision,
    };


    constructor()
    {


    }

    initSpawner()
    {
        this.objectPool = new objectPools();
        this.objectPool.initPools(100, 4, 10);
    }

    update(deltaTime)
    {
        this.updateLevel(deltaTime);
        this.checkCollisions();                                                                     
        this.updateBullets(deltaTime);
    }

    updateLevel(deltaTime)
    {
        this.lastAsteroidSpawn += deltaTime;
        this.lastSaucerSpawn += deltaTime;

        if(this.asteroidSpawnsRemaining > 0 && this.lastAsteroidSpawn >= theGame.levelParams.asteroidsSpawnRate)
        {
            this.spawnAsteroid();
            this.asteroidSpawnsRemaining--;
            this.lastAsteroidSpawn = 0.0;
        }

        if(this.saucerSpawnsRemaining > 0 && this.lastSaucerSpawn >= theGame.levelParams.saucerSpawnRate)
        {
            let randType = Math.random;
            if(randType > 0.3)
            {
                this.spawnSaucer("smallSaucer");
            }
            else
            {
                this.spawnSaucer("largeSaucer");
            }
            
            this.saucerSpawnsRemaining--;
            this.lastSaucerSpawn = 0.0;
        }
            
    }

    initLevel()
    {
        const levelParams = theGame.levelParams;

        this.activeAsteroids = 0;
        this.activeSaucers = 0;
    

        this.asteroidSpawnsRemaining = levelParams.numAsteroids;
        this.saucerSpawnsRemaining = levelParams.numSaucers;

        // spawn starting asteroids and ships
        for(let i = 0; i < levelParams.startingAsteroids; i++)
        {
            this.spawnAsteroid();
            this.asteroidSpawnsRemaining--;
        }

        for(let i = 0; i < levelParams.startingSaucers; i++)
        {
            let randType = Math.random;
            if(randType > 0.3)
            {
                this.spawnSaucer("smallSaucer");
            }
            else
            {
                this.spawnSaucer("largeSaucer");
            }
            
            this.saucerSpawnsRemaining--;
        }

        this.lastAsteroidSpawn = 0.0;
        this.lastSaucerSpawn = 0.0;
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

        theGame.isEnd = true;

    }

    handleBulletAsteroidCollision(objectA, objectB)
    {
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

    handleBulletSaucerCollision(objectA, objectB)
    {
        let bullet = objectA.type === "playerBullet" ? objectA : objectB;

        let saucer; 
        if(objectA.type === "largeSaucer" || objectA.type === "smallSaucer" )
        {
            saucer = objectA;
        }
        else
        {
            saucer = objectB;
        }   
        theGame.spawner.despawnSaucer(saucer);
        theGame.spawner.despawnBullet(bullet);                                                                                      
    }

    handlePlayerSaucerBulletCollision(objectA, objectB)
    {
        let saucerBullet = objectA.type == "saucerBullet" ? objectA : objectB;
        let player = objectA.type === "player" ? objectA : objectB;

        theGame.spawner.despawnBullet(saucerBullet); 
        
        theGame.isEnd = true;                 
    }

    handlePlayerSaucerCollision(objectA, objectB)
    {
        let player = objectA.type === "player" ? objectA : objectB;
        let saucer; 
        if(objectA.type === "largeSaucer" || objectA.type === "smallSaucer" )
        {
            saucer = objectA;
        }
        else
        {
            saucer = objectB;
        } 

        theGame.isEnd = true; 
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
            newAsteroid.gameObject.isActive = true;
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
                vec3.scale(newAsteroid.gameObject.physics.velocity, newAsteroid.gameObject.physics.velocity, 1.2);
                newAsteroid.gameObject.type = "mediumAsteroid";
                break;

            case "smallAsteroid":
                vec3.copy(newAsteroid.gameObject.scale, this.smallAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.smallAsteroidScale[0]) / 2.0;
                vec3.scale(newAsteroid.gameObject.physics.velocity, newAsteroid.gameObject.physics.velocity, 1.5);
                newAsteroid.gameObject.type = "smallAsteroid";
                break;
            default:
                vec3.copy(newAsteroid.gameObject.scale, this.largeAsteroidScale);
                newAsteroid.gameObject.physics.diameter = (3.17 * this.largeAsteroidScale[0]) / 2.0;
                newAsteroid.gameObject.type = "largeAsteroid";
                break;
        }

        this.activeAsteroids++;
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

        theGame.audio.playAudio("explosion");

        this.activeAsteroids--;
    }

    spawnSaucer(saucerType)
    {
        let newSaucer = this.objectPool.getSaucer();

        if(newSaucer == null)
        {
            console.log("no saucers available to spawn");
            return;
        }


        newSaucer.gameObject.position = getRandomLocation();
 
        if(newSaucer.gameObject.isActive)
        {
            theGame.gameObjects.push(newSaucer.gameObject);
        }
        else
        {
            newSaucer.gameObject.isActive = true;
        }


        let velocity = vec3.create();
        vec3.scale(velocity, getRandomVelocity(), 0.1);
        
        newSaucer.gameObject.physics.velocity = velocity;
        newSaucer.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);

        newSaucer.fireRate = 3.0;
        newSaucer.lastFired = 0.0;
        
        switch(saucerType)
        {
            case "largeSaucer":
                newSaucer.gameObject.scale = vec3.fromValues(0.03, 0.03, 0.03);
                newSaucer.gameObject.physics.diameter = 0.18;
                newSaucer.gameObject.type = "largeSaucer";
                break;

            case "smallSaucer":
                newSaucer.gameObject.scale = vec3.fromValues(0.01, 0.01, 0.01);
                newSaucer.gameObject.physics.diameter = 0.06;
                newSaucer.gameObject.type = "smallSaucer";
                break;
            default:
                newSaucer.gameObject.scale = vec3.fromValues(0.03, 0.03, 0.03);
                newSaucer.gameObject.physics.diameter = 0.18;
                newSaucer.gameObject.type = "largeSaucer";
                
        }
        if(this.activeSaucers <= 0)
        {
            theGame.audio.playAudioLoop("alarm");
        }
        this.activeSaucers++;
        return newSaucer;
    }

    despawnSaucer(theSaucer)
    {   
        theSaucer.isActive = false;

        this.objectPool.returnSaucer(theSaucer.index);
        this.activeSaucers--;

        if(this.activeSaucers <= 0)
        {
            theGame.audio.pauseAudio("alarm");
        }
    }

    spawnBullet(position, direction, bulletType = "playerBullet")
    {
        let newBullet = this.objectPool.getBullet();

        if(newBullet == null)
        {
            console.log("no bullets available to spawn");
            return;
        }

        switch(bulletType)
        {
            case "playerBullet":
                newBullet.gameObject.type = "playerBullet";
                newBullet.gameObject.physics.velocity = vec3.scale(direction, direction, 2.0);
                break;
            case "saucerBullet":
                newBullet.gameObject.type = "saucerBullet";
                newBullet.gameObject.physics.velocity = vec3.scale(direction, direction, 1.0);
                break;
            default:
                newBullet.gameObject.type = "playerBullet";
                newBullet.gameObject.physics.velocity = vec3.scale(direction, direction, 2.0);
        }
        
        newBullet.lifetime = 2.0;

        newBullet.gameObject.position = position;

        if(newBullet.gameObject.isActive)
        {
            theGame.gameObjects.push(newBullet.gameObject);
        }
        else
        {
            newBullet.gameObject.isActive = true;
        }

        newBullet.gameObject.scale = vec3.fromValues(0.01, 0.01, 0.01);
        
        newBullet.gameObject.physics.dampening = vec3.fromValues(1.0, 1.0, 1.0);
        newBullet.gameObject.physics.diameter = 0.01;
    }

    despawnBullet(theBullet)
    {
        theBullet.isActive = false;
        this.objectPool.returnBullet(theBullet.index);
    }

    
}

