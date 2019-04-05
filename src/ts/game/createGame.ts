import {
  interval,
  animationFrameScheduler,
  Observable,
  fromEvent,
  merge
} from "rxjs";
import { scan, withLatestFrom, map, startWith } from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";

/**
 * Creates a clock observable
 *
 * @returns The clock observable
 */
function createClock(): Observable<Tick> {
  return interval(0, animationFrameScheduler).pipe(
    map(() => {
      return {
        time: performance.now(),
        delta: 0
      };
    }),
    scan((previous, current) => ({
      time: performance.now(),
      delta: current.time - previous.time
    }))
  );
}

/**
 * Creates an observable of game inputs
 *
 * @returns The game input observable
 */
function createInputObservable(): Observable<InputState> {
  return merge(
    fromEvent(document, "keydown").pipe(
      map<Event, boolean>((event: KeyboardEvent) => {
        return false;
      })
    )
  ).pipe(map<boolean, InputState>(b => ({ pressed: b })));
}

/**
 * Sets up the initial Three.js scene, camera, and objects
 */
function createGame() {
  const clock = createClock();
  const input = createInputObservable().pipe(startWith({ pressed: false }));

  const events = clock.pipe(withLatestFrom(input));
  //events.subscribe((x) => console.log(x));

  return events;
}

export { createGame };
