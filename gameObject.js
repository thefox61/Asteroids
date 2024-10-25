import {mesh} from "./mesh.js"

// static object, only for visual effect. No physics or collisions.
export class staticGameObject
{
    mesh;
    position;
    rotation;

    constructor()
    {
        this.mesh = new mesh();
    }
}

export class dynamicGameObject
{
    mesh;
    position;
    rotation;
    physics;
    collision;

    constructor()
    {
        this.mesh = new mesh();
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