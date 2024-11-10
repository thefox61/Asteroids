import { theGame } from "./main.js";


export class textureManager
{

    textures = [];

    constructor()
    {

    }

    async loadTexture(textureSrc)
    {
        let gl = theGame.render.gl;

        let newTexture = gl.createTexture();

        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

        const internalFormat = gl.RGBA;
        const srcFormat  = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;


        const image = new Image();
        const loadTextureSource = new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error("Failed to load texture image: ${textureSrc}"));
        });

        image.src = textureSrc;

        await loadTextureSource;
        
        gl.bindTexture(gl.TEXTURE_2D,  newTexture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            internalFormat,
            srcFormat,
            srcType,
            image
        );
        
        if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) 
        {
            // Yes, it's a power of 2. Generate mips.
            gl.generateMipmap(gl.TEXTURE_2D);
        } 
        else {
            // No, it's not a power of 2. Turn off mips and set
            // wrapping to clamp to edge
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        return newTexture;  
    }

    loadTextureBuffer()
    {


        // TODO -- move this?
        
    }

    bindTextureBuffer(texture)
    {

    }

    isPowerOf2(value) 
    {
        return (value & (value - 1)) === 0;
    }

}