import { Bird } from './Bird';
import { Pipe } from './Pipe';

export interface GameState {
    state: string,
    player: Bird,
    pipes: Pipe[],
    score: number
}