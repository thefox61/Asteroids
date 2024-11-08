import { theGame } from "./main";


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

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat  = gl.RBGA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0,0,255,255]);


        gl.texImage2D(
            gl.TEXTURE_2D,
            level, 
            internalFormat,
            width,
            height,
            border,
            srcFormat,
            srcType,
            pixel
        );

        const image = new Image();

        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(
              gl.TEXTURE_2D,
              level,
              internalFormat,
              srcFormat,
              srcType,
              image,
            );
        }
        // WebGL1 has different requirements for power of 2 images
        // vs. non power of 2 images so check if the image is a
        // power of 2 in both dimensions.
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) 
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

        image.src = textureSrc;

        // TODO -- move this?
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        
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