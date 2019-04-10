import {
  interval,
  animationFrameScheduler,
  fromEvent,
  merge,
  BehaviorSubject,
  of,
  combineLatest
} from "rxjs";
import {
  scan,
  map,
  startWith,
  combineLatest as combineLatestOperator
} from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";
import { GameState } from "./models/GameState";
import { Bird } from "./models/Bird";
import { Pipe } from "./models/Pipe";

const MAX_HEIGHT = 100;
const PIPE_SPEED = 0.1;

fromEvent(document.querySelector(".mainMenu .github"), "click").subscribe(
  () => (window.location.href = "https://github.com/joshchua/floopy-bird")
);

const clock$ = interval(0, animationFrameScheduler).pipe(
  map<number, Tick>(() => {
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

const input$ = merge(
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

const initBird: Bird = {
  y: MAX_HEIGHT / 2,
  fallSpeed: 0,
  ySpeed: 0
};

const bird$ = combineLatest(of(initBird), clock$, input$).pipe(
  map(([bird, clock, input]) => {
    if (input.pressed == true) {
      bird.fallSpeed = 0;
      bird.ySpeed = -0.2;
    }

    bird.fallSpeed += 0.01;
    const dy = -(bird.fallSpeed + bird.ySpeed);

    if ((bird.y <= 0 && dy < 0) || (bird.y >= MAX_HEIGHT && dy > 0))
      return bird;

    bird.y += dy;
    return bird;
  })
);

const createPipe = (): Pipe => ({
  distance: 300,
  gapPosition: Math.floor(Math.random() * MAX_HEIGHT)
});

const pipes$ = interval(4000).pipe(
  scan<number, Pipe[]>(acc => [...acc, createPipe()], []),
  combineLatestOperator(clock$),
  map(([pipes]) => {
    pipes.forEach(p => (p.distance -= PIPE_SPEED));
    return pipes.filter(p => p.distance > -10).slice(0, 7);
  }),
  startWith([])
);

const scene$ = merge(
  fromEvent(document.querySelector(".mainMenu .startGame"), "click").pipe(
    map(() => "game")
  )
).pipe(
  combineLatestOperator(bird$, pipes$, clock$),
  map(([scene, bird, pipes]) => {
    return scene;
  }),
  startWith("main-menu")
);

scene$.subscribe(s => {
  if (s == "game") {
    document.querySelector(".mainMenu").setAttribute("class", "hidden");
  }
});

/**
 * An observable of GameStates
 */
const game$ = combineLatest(scene$, bird$, pipes$).pipe(
  map<any, GameState>(([scene, bird, pipes]) => ({
    scene: scene,
    bird: bird,
    pipes: pipes
  }))
);

export { game$ };
