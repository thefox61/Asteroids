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

export function getPlayerDirection()
{
    let playerGameObject = theGame.player.gameObject;
    let matRotation = mat4.create();
        
    mat4.rotate(
        matRotation, 
        matRotation, 
        playerGameObject.rotation[0], 
        [1,0,0],
    ); 
    mat4.rotate(
        matRotation, 
        matRotation, 
        playerGameObject.rotation[1], 
        [0,1,0],
    ); 
    mat4.rotate(
        matRotation, 
        matRotation, 
        playerGameObject.rotation[2], 
        [0,0,1],
    ); 


    let direction = vec4.create();
    direction[1] = 1.0;

    vec4.transformMat4(direction,direction, matRotation);

    return direction;
}

export function getRandDirection()
{
    const currBoundaries = theGame.physics.boundaries;
    const xMax = currBoundaries[2];
    const xMin = currBoundaries[0];

    const yMax = currBoundaries[3];
    const yMin = currBoundaries[1];

    let randX = Math.random() * (xMax - xMin) + xMin;
    let randY = Math.random() * (yMax - yMin) + yMin;

    // normalize 
    randX = (randX - xMin) / xMax - xMin; 
    randY = (randY - yMin) / yMax - yMin;

    // TODO --  z depth needs to be stored somewhere
    return vec3.fromValues(randX, randY, 0.0);  
}

export function getDirectionTowardsPlayer(position)
{
    let direction = vec3.create();

    let playerPos = theGame.player.gameObject.position;
    
    vec3.sub(direction, playerPos, position);

    vec3.normalize(direction, direction);

    return direction;
}
