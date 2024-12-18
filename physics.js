import { game } from "./game.js";
import { dynamicGameObject } from "./gameObject.js"
import { physicsComponent } from "./physicsComponent.js"

export class collision
{   
    objectA;
    objectB;

}

export class physics
{

    collisionsThisFrame = [];
    numCollisionsThisFrame = 0;

    maxCollisions = 100;

    boundaries;
    constructor(boundaries)
    {
        this.boundaries = boundaries;
        this.collisionsThisFrame.length = this.maxCollisions;
    }

    updateMovement(gameObjects, deltaTime)
    {
        for(let i = 0; i < gameObjects.length; i++)
        {
            let currPhysics = gameObjects[i].physics;

            let deltaVelocity = vec3.create();
            vec3.scale(deltaVelocity, currPhysics.acceleration, deltaTime);

            vec3.add( currPhysics.velocity,  currPhysics.velocity, deltaVelocity)

            let deltaPosition = vec3.create();
            vec3.scale(deltaPosition, currPhysics.velocity, deltaTime);

            vec3.add(gameObjects[i].position, gameObjects[i].position, deltaPosition);

            
            let dampeningValue = 1.0 - currPhysics.dampening[0];
            dampeningValue = dampeningValue * deltaTime;

            let currDampening = vec3.fromValues(dampeningValue, dampeningValue, dampeningValue);

            vec3.mul(currDampening, currPhysics.velocity, currDampening);

            //vec3.scale(currDampening, currPhysics.dampening, deltaTime);

            //vec3.mul( currPhysics.velocity,  currPhysics.velocity , currPhysics.dampening)
            
            vec3.sub(currPhysics.velocity, currPhysics.velocity, currDampening);


        }
    }

    checkCollisions(gameObjects)
    {
        this.numCollisionsThisFrame = 0;

        for(let i = 0; i < gameObjects.length; i++)
        {   
            if(!gameObjects[i].isActive)
            {
                continue;
            }
            this.isOutsideBoundaries(gameObjects[i]);
        }

        for(let i = 0; i < gameObjects.length; i++)
        {
            if(!gameObjects[i].isActive)
            {
                continue;
            }

            for(let j = i + 1; j < gameObjects.length; j++ )
            {
                if(!gameObjects[j].isActive)
                {
                    continue;
                }

                if(this.checkCollision(gameObjects[i], gameObjects[j]))
                {
                    console.log("Collision!", gameObjects[i].type, gameObjects[j].type);
                    const thisCollision = new collision();

                    thisCollision.objectA = i;
                    thisCollision.objectB = j;

                    if(this.numCollisionsThisFrame >= this.maxCollisions)
                    {
                        this.maxCollisions = this.maxCollisions * 2;
                        this.collisionsThisFrame.length = this.maxCollisions;
                    }

                    this.collisionsThisFrame[this.numCollisionsThisFrame] = thisCollision;
                    this.numCollisionsThisFrame++;
                }
            }
        }

    }

    checkCollision(objectA, objectB)
    {
        let distance = vec3.distance(objectA.position, objectB.position);

        if(distance <= (objectA.physics.diameter + objectB.physics.diameter))
        {
            return true;
        }
        
        return false;
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