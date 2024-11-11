import { level } from "./level.js";

export class levelManager
{
    baseParams;

    multiplier;


    constructor()
    {
        this.baseParams = new level();
        this.baseParams.numAsteroids = 10;
        this.baseParams.startingAsteroids = 5;    
        this.baseParams.numSaucers = 2;
    }

    checkFinished()
    {

    }

    updateLevel()
    {

    }

    reset()
    {

    }

}