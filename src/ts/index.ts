import "./../scss/index.scss";
import { game$ } from "./game/Game";
import { renderGameState } from "./graphics/renderGame";

game$.subscribe(renderGameState);
