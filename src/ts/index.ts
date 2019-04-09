import "./../scss/index.scss";
import { createGame } from "./game/createGame";
import { renderGame } from "./graphics/renderGame";

let game = createGame();
let render = renderGame();
game.subscribe(x => render(x));
//game.subscribe(x => console.log(x));
