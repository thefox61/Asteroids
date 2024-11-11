import { level } from "./level.js";
import { theGame } from "./main.js";
export class levelManager
{

    multiplier;


    constructor()
    {
    
    }

    init()
    {
        theGame.levelParams = new level();

        theGame.levelParams.numAsteroids = 5;
        theGame.levelParams.startingAsteroids = 2;    
        theGame.levelParams.numSaucers = 1;
        theGame.levelParams.startingSaucers = 0;
        theGame.levelParams.asteroidSpawnRate = 5.0;
        theGame.levelParams.saucerSpawnRate = 10.0;

    }
    checkFinished()
    {
        let remaining = theGame.spawner.activeAsteroids + theGame.spawner.activeSaucers + theGame.spawner.asteroidSpawnsRemaining + theGame.spawner.saucerSpawnsRemaining;

        if(remaining <= 0)
        {
            this.updateLevel();
            theGame.spawner.initLevel();
        }
    }

    updateLevel()
    {
        theGame.levelParams.numAsteroids *= 2;
        theGame.levelParams.startingAsteroids *= 2;    
        theGame.levelParams.numSaucers++;
        theGame.levelParams.startingSaucers++;
        theGame.levelParams.asteroidSpawnRate = 5.0;
        theGame.levelParams.saucerSpawnRate = 10.0;
    }

    reset()
    {
        theGame.levelParams.numAsteroids = 5;
        theGame.levelParams.startingAsteroids = 2;    
        theGame.levelParams.numSaucers = 1;
        theGame.levelParams.startingSaucers = 0;
        theGame.levelParams.asteroidSpawnRate = 5.0;
        theGame.levelParams.saucerSpawnRate = 10.0;
    }

}