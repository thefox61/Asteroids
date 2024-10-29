
export class physicsComponent
{
    velocity;
    acceleration;
    lastPosition;
    dampening;

    diameter;

    constructor()
    {
        this.velocity = vec3.create();
        this.acceleration = vec3.create();
        this.lastPosition = vec3.create();
        this.dampening = vec3.fromValues(1.0, 1.0, 1.0);
    }

}