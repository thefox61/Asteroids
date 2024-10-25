// render game objects
import {mesh, vertex} from "./mesh.js"

export class renderer
{
    shaderProgram;
    gl;

    constructor()
    {

    }

    initRender(vsShader, fsShader)
    {
        const canvas = document.querySelector("#glcanvas");

        // Initialize the GL context
        this.gl = canvas.getContext("webgl");


        this.shaderProgram = this.createShaderProgram(vsShader, fsShader);


         
    }

    createShaderProgram(vsShader, fsShader)
    {
        const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vsShader);
        const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fsShader);

        // Create the shader program

        const shaderProgram = this.gl.createProgram();
        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);

        // If creating the shader program failed, alert

        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
            alert(
            `Unable to initialize the shader program: ${this.gl.getProgramInfoLog(
                shaderProgram,
            )}`,
            );
            return null;
        }

        return shaderProgram;
    }

    compileShader(shaderType, shaderSource)
    {
        const shader = this.gl.createShader(shaderType);

        // Send the source to the shader object

        this.gl.shaderSource(shader, shaderSource);

        // Compile the shader program

        this.gl.compileShader(shader);

        // See if it compiled successfully

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(
            `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`,
            );
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    loadMeshBuffers(mesh)
    {
        this.gl.useProgram(this.shaderProgram);

        // create vertex buffer for this mesh
        mesh.vertexBufferID = this.gl.createBuffer();

        

        const numVertices = mesh.vertices.length;
        const numIndices = mesh.indices.length;

        const vertices = [];

        // convert vertex class array into raw data
        for(let i = 0; i < numVertices; i++)
        {
            const currVertex = mesh.vertices[i]; 

            vertices.push(currVertex.position[0], currVertex.position[1], currVertex.position[2], 
                            currVertex.normals[0], currVertex.normals[1], currVertex.normals[2],
                            currVertex.texCoords[0], currVertex.texCoords[1]);
            
        }

        // bind vertex buffer and buffer the raw data
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,  mesh.vertexBufferID);

        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);


        
        mesh.indexBufferID = this.gl.createBuffer();

        // convert index array into raw data
        const indices = [];

        for(let i = 0; i < numIndices; i++)
        {
            const currIndex = mesh.indices[i];

           // indices.concat(currIndex[0], currIndex[1], currIndex[2]);
           indices.push(currIndex[0]);
           indices.push(currIndex[1]);
           indices.push(currIndex[2]);
        }
        
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.indexBufferID);

        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(indices),
            this.gl.STATIC_DRAW,
        );
        
        return;
    }

    loadUniformLocations(mesh)
    {
        this.gl.useProgram(this.shaderProgram);

        console.log(this.shaderProgram);
       
        mesh.position_UL = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        console.log(mesh.position_UL);

        mesh.normal_UL = this.gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
        console.log(mesh.normal_UL);
        
        mesh.texCoord_UL = this.gl.getAttribLocation(this.shaderProgram, "aVertexTexCoords");
        console.log(mesh.texCoord_UL);

        mesh.modelView_UL = this.gl.getUniformLocation(this.shaderProgram, "uModelViewMatrix");
        console.log(mesh.modelView_UL);

        mesh.projection_UL = this.gl.getUniformLocation(this.shaderProgram, "uProjectionMatrix");
        console.log(mesh.projection_UL);
        
        
        
        
        

        // vertex - pos, pos, pos, norm, norm, norm, tex, tex -- 4 bytes each
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,  mesh.vertexBufferID);

        this.gl.vertexAttribPointer(
            mesh.position_UL,
            3,
            this.gl.FLOAT,
            false,
            32,
            0,
        );

        // TODO -- do we need to enable these here?
        this.gl.enableVertexAttribArray(mesh.position_UL);

        this.gl.vertexAttribPointer(
            mesh.normal_UL,
            3,
            this.gl.FLOAT,
            false,
            32,
            12,
        );

        this.gl.enableVertexAttribArray(mesh.normal_UL);

        this.gl.vertexAttribPointer(
            mesh.texCoord_UL,
            2,
            this.gl.FLOAT,
            false,
            32,
            24,
        );

        this.gl.enableVertexAttribArray(mesh.texCoord_UL);

        this.gl.disableVertexAttribArray(mesh.position_UL);
        this.gl.disableVertexAttribArray(mesh.normal_UL);
        this.gl.disableVertexAttribArray(mesh.texCoord_UL);

        return;
    }
    
    renderGameObjects(gameObjects)
    {
        this.gl.useProgram(this.shaderProgram);

        if (this.gl === null) {
            alert( "WebGL is not initialized. Unable to render objects.");
            return;
        }

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        this.gl.clearDepth(1.0); // Clear everything
        this.gl.enable(this.gl.DEPTH_TEST); // Enable depth testing
        this.gl.depthFunc(this.gl.LEQUAL); // Near things obscure far things
    
    
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        const fieldOfView = (45 * Math.PI) / 180; // in radians
        const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();
    
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        this.renderObject(gameObjects, projectionMatrix);

    }
    
    renderObject(gameObject, projectionMatrix)
    {
        const currMesh = gameObject.mesh;

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, currMesh.vertexBufferID);

        this.gl.enableVertexAttribArray(currMesh.position_UL);
        this.gl.enableVertexAttribArray(currMesh.normal_UL);
        this.gl.enableVertexAttribArray(currMesh.texCoord_UL);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, currMesh.indexBufferID);

        const modelViewMatrix = mat4.create();


        mat4.translate(
            modelViewMatrix, 
            modelViewMatrix, 
            gameObject.position,
        ); 

        mat4.rotate(
            modelViewMatrix, 
            modelViewMatrix, 
            gameObject.rotation[0], 
            [1,0,0],
        ); 
        mat4.rotate(
            modelViewMatrix, 
            modelViewMatrix, 
            gameObject.rotation[1], 
            [0,1,0],
        ); 
        mat4.rotate(
            modelViewMatrix, 
            modelViewMatrix, 
            gameObject.rotation[2], 
            [0,0,1],
        ); 

        this.gl.useProgram(this.shaderProgram);

        this.gl.uniformMatrix4fv(
            currMesh.projection_UL,
            false,
            projectionMatrix,
        );
        this.gl.uniformMatrix4fv(
            currMesh.modelView_UL,
            false,
            modelViewMatrix,
        );
        


        {
            const vertexCount = currMesh.indices.length * 3;
            const type = this.gl.UNSIGNED_SHORT;
            const offset = 0;
            this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
        }
        
        this.gl.disableVertexAttribArray(currMesh.position_UL);
        this.gl.disableVertexAttribArray(currMesh.normal_UL);
        this.gl.disableVertexAttribArray(currMesh.texCoord_UL);

        return;
    }
}

