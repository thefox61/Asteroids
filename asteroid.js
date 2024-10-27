
export class asteroid
{
    meshName = "PS1_style_low poly asteroids.ply";
    gameObject;

    asteroidType;

    id = -1;

    contructor()
    {
        //this.gameObject = new dynamicGameObject();
        this.gameObject.scale = vec3.fromValues(0.05, 0.05, 0.05);
        this.gameObject.physics.dampening = vec3.fromValues(0.99, 0.99, 0.99);
    }
}