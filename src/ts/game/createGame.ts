import {
  interval,
  animationFrameScheduler,
  Observable,
  fromEvent,
  merge,
  BehaviorSubject,
  of
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
import { GameState } from "./models/GameState";
import { Bird } from "./models/Bird";

const update = () => {};

/**
 * Creates an Observable of game states
 *
 * @returns Observable of game states
 */
const createGame = () => {
  const scene = new BehaviorSubject("main-menu");

  fromEvent(document.querySelector(".mainMenu .startGame"), "click").subscribe(
    () => scene.next("game")
  );

  fromEvent(document.querySelector(".mainMenu .github"), "click").subscribe(
    () => (window.location.href = "https://github.com/joshchua/floopy-bird")
  );

  scene.subscribe(s => {
    if (s == "game") {
      document
        .getElementsByClassName("mainMenu")[0]
        .setAttribute("class", "hidden");
    }
  });

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
        return true;
      })
    ),
    fromEvent(document, "keyup").pipe(
      map<Event, boolean>((event: KeyboardEvent) => {
        return false;
      })
    )
  ).pipe(
    map<boolean, InputState>(b => ({ pressed: b })),
    startWith({ pressed: false })
  );

  let b: Bird = {
    y: 10,
    fallSpeed: 0,
    ySpeed: 0
  };

  let bird = of(b).pipe(
    combineLatest(clock, input),
    map(([bird, clock, input]) => {
      if (input.pressed == true) {
        bird.fallSpeed = 0;
        bird.ySpeed = -.2;
      }

      bird.fallSpeed += .01;
      bird.y -= bird.fallSpeed + bird.ySpeed;
      return bird;
    })
  );

  const events = clock.pipe(
    combineLatest(scene, input, bird),
    map(([clock, scene, input, bird]) => ({
      clock: clock,
      scene: scene,
      input: input,
      bird: bird
    }))
  );

  

  events.subscribe(x => console.log(x));

  events.pipe(take(10)).subscribe(x => console.log(x));

  return events;
};

export { createGame };
