export class vertex
{
    position;
    normals;
    texCoords;

    constructor(position, normals, texCoords)
    {
        this.position = position;
        this.normals = normals;
        this.texCoords = texCoords;
    }
}

export class mesh
{
    vertices = [];
    indices = [];
    texture = [];
    vertexBufferID = -1;
    indexBufferID = -1;
    texBufferID = -1;

    position_UL = -1;
    normal_UL = -1; 
    texCoord_UL = -1;
    modelView_UL = -1;
    projection_UL = -1;

    constructor(vertices, indices)
    {   
        this.vertices = vertices;
        this.indices = indices;
    }
}


