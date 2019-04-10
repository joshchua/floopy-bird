import "./../scss/index.scss";
import { game$ } from "./game/game";
import { renderGameState } from "./graphics/renderGame";

game$.subscribe(renderGameState);
