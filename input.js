import { theGame } from "./main.js";
import { getPlayerDirection } from "./utilityFunctions.js";

export function handleKeyDown(event)
{
    let playerGameObject = theGame.player.gameObject;
    if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
    }
    
    switch (event.key) {
        case "w":
            let direction = getPlayerDirection();
        
            vec3.scale(playerGameObject.physics.acceleration, vec3.fromValues(direction[0], direction[1], direction[2]), 0.05);
            console.log(direction);

            break;
        case "a":
            playerGameObject.rotation[2] += 0.2;
            break;
        case "d":
            playerGameObject.rotation[2] -= 0.2;
            break;
        case " ":
            let position = vec3.create();
            vec3.copy(position, theGame.player.gameObject.position);
            let bulletDirection = getPlayerDirection();
            theGame.spawner.spawnBullet(position, bulletDirection);
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

  