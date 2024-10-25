import { dynamicGameObject } from "./gameObject.js"
import { physicsComponent } from "./physicsComponent.js"

export class physics
{

    boundaries;
    constructor(boundaries)
    {
        this.boundaries = boundaries;
    }

    updateMovement(gameObjects, deltaTime)
    {
        for(let i = 0; i < gameObjects.length; i++)
        {
            let currPhysics = gameObjects[i].physics;

            //currPhysics.acceleration = currPhysics.acceleration * currPhysics.dampening;
            // vec3.mul( currPhysics.acceleration,  currPhysics.acceleration, currPhysics.dampening)

            let deltaVelocity = vec3.create();
            vec3.scale(deltaVelocity, currPhysics.acceleration, deltaTime);
            //currPhysics.velocity = currPhysics.velocity * currPhysics.acceleration;
            vec3.add( currPhysics.velocity,  currPhysics.velocity, currPhysics.acceleration)

            //let deltaPosition = currPhysics.velocity * deltaTime;
            let deltaPosition = vec3.create();
            vec3.scale(deltaPosition, currPhysics.velocity, deltaTime);

            
            //gameObjects[i].position = gameObjects[i].position + deltaPosition;
            vec3.add(gameObjects[i].position, gameObjects[i].position, deltaPosition);

            let currDampening = vec3.create();
            vec3.scale(currDampening, currPhysics.dampening, deltaTime);

            vec3.mul( currPhysics.velocity,  currPhysics.velocity , currPhysics.dampening)

            

            //console.log(gameObjects[i].position);
        }
    }

    checkCollisions(gameObjects)
    {
        for(let i = 0; i < gameObjects.length; i++)
        {   
            this.isOutsideBoundaries(gameObjects[i]);
            
        }
    }

    isOutsideBoundaries(gameObject)
    {
        let pos = gameObject.position;
        if(this.boundaries[0] > pos[0])
        {
            gameObject.position[0] = this.boundaries[2];
        }
        if(this.boundaries[2] < pos[0])
        {
            gameObject.position[0] = this.boundaries[0];
        }
        if(this.boundaries[1] > pos[1])
        {
            gameObject.position[1] = this.boundaries[3];
        }
        if(this.boundaries[3] < pos[1])
        {
            gameObject.position[1] = this.boundaries[1];
        }

    }

}