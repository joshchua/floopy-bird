import {
  interval,
  animationFrameScheduler,
  Observable,
  fromEvent,
  merge
} from "rxjs";
import {
  scan,
  withLatestFrom,
  map,
  startWith,
  take,
  combineLatest
} from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";

const update = () => {

};

/**
 * Sets up the initial Three.js scene, camera, and objects
 */
const createGame = () => {
  const clock = interval(0, animationFrameScheduler).pipe(
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

  const input = merge(
    fromEvent(document, "keydown").pipe(
      map<Event, boolean>((event: KeyboardEvent) => {
        return false;
      })
    )
  ).pipe(
    map<boolean, InputState>(b => ({ pressed: b })),
    startWith({ pressed: false })
  );

  const events = clock.pipe(
    combineLatest(input),
    map(([clock, input]) => ({ clock: clock, input: input }))
  );

  events.pipe(take(10)).subscribe(x => console.log(x));

  return events;
};

export { createGame };
