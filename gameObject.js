import {mesh} from "./mesh.js"

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
    
    position;
    rotation;
    scale;

    physics;
    collision;

    constructor()
    {
        this.mesh = new mesh();
        this.scale = vec3.create();
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