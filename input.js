import { theGame } from "./main.js";

export function handleKeyDown(event)
{
    let playerGameObject = theGame.player.gameObject;
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    
    switch (event.key) {
        case "w":
        // code for "down arrow" key press.
    
        let matRotation = mat4.create();
    
        mat4.rotate(
            matRotation, 
            matRotation, 
            playerGameObject.rotation[0], 
            [1,0,0],
        ); 
        mat4.rotate(
            matRotation, 
            matRotation, 
            playerGameObject.rotation[1], 
            [0,1,0],
        ); 
        mat4.rotate(
            matRotation, 
            matRotation, 
            playerGameObject.rotation[2], 
            [0,0,1],
        ); 
    
    
        let direction = vec4.create();
        direction[1] = 1.0;
    
        vec4.transformMat4(direction,direction, matRotation);
    
        vec3.scale(playerGameObject.physics.acceleration, vec3.fromValues(direction[0], direction[1], direction[2]), 0.05);
        console.log(direction);
        //asteroid.physics.acceleration = 0.5;
        break;
        case "a":
        // code for "up arrow" key press.
        playerGameObject.rotation[2] += 0.2;
        break;
        case "d":
        // code for "left arrow" key press.
        playerGameObject.rotation[2] -= 0.2;
        break;
        default:
        console.log(event.key);
        return; // Quit when this doesn't handle the key event.
    }

    // Cancel the default action to avoid it being handled twice
    event.preventDefault();
}

export function handleKeyUp(event)
{
    let playerGameObject = theGame.player.gameObject;
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }
    
      switch (event.key) {
        case "w":
          // code for "down arrow" key press.
    
          vec3.set(playerGameObject.physics.acceleration, 0.0, 0.0, 0.0);
          break;
    
        default:
          //console.log(event.key);
          return; // Quit when this doesn't handle the key event.
      }
    
      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
}

  