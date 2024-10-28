import { theGame } from "./main.js";


export function getRandomLocation()
{
    const currBoundaries = theGame.physics.boundaries;
    const xMax = currBoundaries[2];
    const xMin = currBoundaries[0];

    const yMax = currBoundaries[3];
    const yMin = currBoundaries[1];

    const randX = Math.random() * (xMax - xMin) + xMin;
    const randY = Math.random() * (yMax - yMin) + yMin;

    // TODO --  z depth needs to be stored somewhere
    return vec3.fromValues(randX, randY, -6.0);
}

export function getRandomVelocity()
{
    const currBoundaries = theGame.physics.boundaries;
    const xMax = currBoundaries[2];
    const xMin = currBoundaries[0];

    const yMax = currBoundaries[3];
    const yMin = currBoundaries[1];

    const randX = Math.random() * (xMax - xMin) + xMin;
    const randY = Math.random() * (yMax - yMin) + yMin;

    // TODO --  z depth needs to be stored somewhere
    return vec3.fromValues(randX, randY, 0.0);
}


export function getSpawnLocation()
{
   // TODO 
   // random location but on the outskirts of the boundaries
}
