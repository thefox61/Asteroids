import { dynamicGameObject } from "./gameObject.js"
import { physicsComponent } from "./physicsComponent.js"

export class physics
{
    constructor()
    {
        
    }

    updateMovement(gameObjects, deltaTime)
    {
        for(let i = 0; i < gameObjects.length; i++)
        {
            let currPhysics = gameObjects[i].physics;

            //currPhysics.acceleration = currPhysics.acceleration * currPhysics.dampening;
            vec3.mul( currPhysics.acceleration,  currPhysics.acceleration, currPhysics.dampening)

            //currPhysics.velocity = currPhysics.velocity * currPhysics.acceleration;
            vec3.mul( currPhysics.velocity,  currPhysics.velocity, currPhysics.acceleration)

            //let deltaPosition = currPhysics.velocity * deltaTime;
            let deltaPosition = vec3.create();
            vec3.scale(deltaPosition, currPhysics.velocity, deltaTime);

            
            //gameObjects[i].position = gameObjects[i].position + deltaPosition;
            vec3.add(gameObjects[i].position, gameObjects[i].position, deltaPosition);


            console.log(gameObjects[i].position);
        }
    }

}