import { dynamicGameObject } from "./gameObject.js";
import { loadPLY } from "./plyLoader.js";

export class player
{
    rotationSpeed = 0.2;
    accelerationRate = 0.05;
    meshName = "spaceship.ply";
    gameObject;

    contructor()
    {
        //this.gameObject = new dynamicGameObject();
        this.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        this.gameObject.physics.dampening = vec3.fromValues(0.99, 0.99, 0.99);
    }

}