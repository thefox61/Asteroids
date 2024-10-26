import {mesh} from "./mesh.js"
import { physicsComponent } from "./physicsComponent.js";

// static object, only for visual effect. No physics or collisions.
export class staticGameObject
{
    mesh;
    position;
    rotation;
    scale;

    constructor()
    {
        this.mesh = new mesh();
        this.scale = vec3.create();
    }
}

export class dynamicGameObject
{
    mesh;
    
    position = vec3.create();
    rotation = vec3.create();
    scale = vec3.fromValues(1.0, 1.0, 1.0);

    physics;
    collision;

    constructor()
    {
        this.mesh = new mesh();
        this.physics = new physicsComponent();
    }
}

export class playerGameObject
{
    mesh;
    position;
    rotation;
    physics;
    collision;
    input;

    constructor()
    {
        this.mesh = new mesh();
    }
}