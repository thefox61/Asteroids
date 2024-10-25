import {vertex, mesh} from "./mesh.js"


export async function loadPLY(filename)
{
    const response = await fetch(filename);
    const text = await response.text();

    const lines = text.split('\n');


    let lineIdx = 0;

    while(lines[lineIdx].split(" ")[0] != 'element')
    {
        lineIdx++;
    }

    var numVertices = lines[lineIdx].split(" ")[2];
    lineIdx++;

    while(lines[lineIdx].split(" ")[0] != 'element')
    {
        lineIdx++;
    }
    
    var numIndices = lines[lineIdx].split(" ")[2];

    console.log(numVertices);
    console.log(numIndices);

    while(lines[lineIdx].split(" ")[0] != 'end_header')
    {
        lineIdx++;
    }

    lineIdx++;

   
    
    const vertices = [];
    const indices = [];

    // start of vertices
    for(let i = 0; i < numVertices; i++)
    {
        var splitVertex = lines[lineIdx].split(" ");

        if(splitVertex.length != 8)
        {
            console.log("error loading ply file -- vertex not expected length")
            return;
        }
        var position = vec3.create();
        position[0] = splitVertex[0];
        position[1] = splitVertex[1];
        position[2] = splitVertex[2];

        var normal = vec3.create();
        normal[0] = splitVertex[3];
        normal[1] = splitVertex[4];
        normal[2] = splitVertex[5];

        var texCoord = vec2.create();
        texCoord[0] = splitVertex[6];
        texCoord[1] = splitVertex[7];
        
        vertices.push(new vertex(position, normal, texCoord));

        lineIdx++;
    }

    for(let i = 0; i < numIndices; i++)
    {
        var splitIndex = lines[lineIdx].split(" ");

        if(splitIndex.length != 4)
        {
            console.log("error loading ply file -- index not expected length")
            console.log(splitIndex.length);
            return;
        }

        var index = vec3.create();
        index[0] = splitIndex[1];
        index[1] = splitIndex[2];
        index[2] = splitIndex[3];
        
        indices.push(index);

        lineIdx++;
    }

    //theMesh.vertexBufferID = "does this survive?";

    let theMesh = new mesh(vertices, indices);

    console.log(theMesh.vertices);
    
    return theMesh;
}
