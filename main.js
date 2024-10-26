import { handleKeyDown, handleKeyUp } from "./input.js";
import { game } from "./game.js"

// python -m http.server

window.addEventListener("keydown", handleKeyDown, true);
window.addEventListener("keyup", handleKeyUp, true);

const theGame = new game();
export {theGame};

main();


function main()
{
  theGame.init();
}