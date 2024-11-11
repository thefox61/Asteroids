import { mesh, vertex } from "./mesh.js"
import { theGame } from "./main.js";

export class textRenderer
{
    textMeshes = [];

    fontTexture;
    fontInfo;

    constructor()
    {

    }

    async init(fontTextureSrc, fontInfo)
    {   
        this.fontTexture = await theGame.texturer.loadTexture(fontTextureSrc, false);

        this.fontInfo = fontInfo;
        
    }


    generateTextMesh(text)
    {
        const length = text.length;
        const numVertices = length * 6;

        const vertices = [];
        const indices = [];

        let offset = 0;
        

        const maxX = this.fontInfo.width;
        const maxY = this.fontInfo.height;

        let textLength = 0;

        for(let i = 0; i < length; i++)
        {
            textLength += this.fontInfo.characters[text[i]].advance;
        }

        // center text
        let x = -textLength / 2;
        let y = this.fontInfo.size / 2;

        let indexCount = 0;
        for(let i = 0; i < length; i++)
        {
            const currChar = this.fontInfo.characters[text[i]];

            // vertex 1
            var position1 = vec3.create();
            position1[0] = x - currChar.originX;
            position1[1] = y - currChar.originY;
            position1[2] = 0.0;
            
            var normal1 = vec3.create();
            normal1[0] = 0.0;
            normal1[1] = 0.0;
            normal1[2] = 0.0;
    
            var texCoord1 = vec2.create();
            texCoord1[0] = currChar.x / maxX;
            texCoord1[1] = currChar.y / maxY;

            // vertex 2
            var position2 = vec3.create();
            position2[0] = x - currChar.originX + currChar.width;
            position2[1] = y - currChar.originY;
            position2[2] = 0.0;
            
            var normal2 = vec3.create();
            normal2[0] = 0.0;
            normal2[1] = 0.0;
            normal2[2] = 0.0;
    
            var texCoord2 = vec2.create();
            texCoord2[0] = (currChar.x + currChar.width) / maxX;
            texCoord2[1] = currChar.y / maxY;

            // vertex 3
            var position3 = vec3.create();
            position3[0] = x - currChar.originX;
            position3[1] = y - currChar.originY + currChar.height;
            position3[2] = 0.0;
            
            var normal3 = vec3.create();
            normal3[0] = 0.0;
            normal3[1] = 0.0;
            normal3[2] = 0.0;
    
            var texCoord3 = vec2.create();
            texCoord3[0] = currChar.x / maxX;
            texCoord3[1] = (currChar.y + currChar.height) / maxY;

            // vertex 4 
            var position4 = vec3.create();
            position4[0] = x - currChar.originX + currChar.width;
            position4[1] = y - currChar.originY + currChar.height;
            position4[2] = 0.0;
            
            var normal4 = vec3.create();
            normal4[0] = 0.0;
            normal4[1] = 0.0;
            normal4[2] = 0.0;
    
            var texCoord4 = vec2.create();
            texCoord4[0] = (currChar.x + currChar.width) / maxX;
            texCoord4[1] = (currChar.y + currChar.height) / maxY;

            vertices.push(new vertex(position1, normal1, texCoord1));
            vertices.push(new vertex(position2, normal2, texCoord2));
            vertices.push(new vertex(position4, normal4, texCoord4));
            vertices.push(new vertex(position1, normal1, texCoord1));
            vertices.push(new vertex(position4, normal4, texCoord4));
            vertices.push(new vertex(position3, normal3, texCoord3));

            indices.push(vec3.fromValues(indexCount + 0, indexCount + 1, indexCount + 2));
            indices.push(vec3.fromValues(indexCount + 3, indexCount + 4, indexCount + 5));

            indexCount += 6;

            x += currChar.advance;
        }   

        const textMesh = new mesh(vertices, indices);
        console.log("textMesh: ", textMesh);

        textMesh.texture = this.fontTexture;
        textMesh.bHasTexture = true;

        return textMesh;
    }



}
