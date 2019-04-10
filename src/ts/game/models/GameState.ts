import { Bird } from "./Bird";
import { Pipe } from "./Pipe";

export interface GameState {
  scene?: string;
  bird?: Bird;
  pipes?: Pipe[];
  score?: number;
}
