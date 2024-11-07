import { theGame } from "./main.js";
import { getDirectionTowardsPlayer, getRandDirection, getRandomVelocity } from "./utilityFunctions.js";

export function updateSaucers(deltaTime)
{
    // load the saucers from object pool

    let saucers = theGame.spawner.objectPool.saucers;

    for(let i = 0; i < saucers.length; i++)
    {
        let currSaucer = saucers[i];

        if((!currSaucer.gameObject.isActive) || currSaucer.fireRate === 0.0)
        {
            continue;
        }

        currSaucer.lastFired += deltaTime;

        if(currSaucer.lastFired >= currSaucer.fireRate)
        {
            shootSaucer(currSaucer);
            currSaucer.lastFired = 0.0;
        }

    }
}

export function shootSaucer(theSaucer, targetPlayer = false)
{
    let direction = vec3.create();  

    if(targetPlayer)
    {
        direction = getDirectionTowardsPlayer(theSaucer.gameObject.position);
    }
    else
    {
        direction = getRandomVelocity();
    }

    let bulletPos = vec3.create();
    vec3.copy(bulletPos, theSaucer.gameObject.position);

    theGame.spawner.spawnBullet(bulletPos, direction, "saucerBullet");
    console.log("saucer shooting!"); 
}