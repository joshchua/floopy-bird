import {
  interval,
  animationFrameScheduler,
  fromEvent,
  merge,
  of,
  combineLatest,
  timer,
  BehaviorSubject,
  Subject
} from "rxjs";
import {
  scan,
  map,
  startWith,
  combineLatest as combineLatestOperator,
  tap,
  take,
  withLatestFrom,
  throttleTime,
  takeWhile,
  switchMapTo
} from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";
import { GameState } from "./models/GameState";
import { Bird } from "./models/Bird";
import { Pipe } from "./models/Pipe";

const MAX_HEIGHT = 100;
const PIPE_SPEED = 0.1;
const PIPE_WIDTH = 10; // Placeholder values...
const BIRD_WIDTH = 10;
const BIRD_HEIGHT = 10;

const mainMenuEl = document.querySelector(".mainMenu");
const gameOverEl = document.querySelector(".gameOver");
const scoreEl = document.querySelector(".score");

const startGameBtn = document.querySelector(".mainMenu .startGame");
const playAgainBtn = document.querySelector(".gameOver button");

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

const scene$ = new BehaviorSubject("main-menu");

merge(
  fromEvent(startGameBtn, "click").pipe(map(() => "game")),
  fromEvent(playAgainBtn, "click").pipe(map(() => "main-menu"))
).subscribe(scene$);

scene$.subscribe(s => {
  const hideEl = (...el: Element[]) =>
    el.forEach(e => e.setAttribute("class", "hidden"));
  const showEl = (...el: Element[]) =>
    el.forEach(e => e.classList.remove("hidden"));
  if (s == "game") {
    hideEl(mainMenuEl, gameOverEl);
    showEl(scoreEl);
  } else if (s == "game-over") {
    hideEl(mainMenuEl, scoreEl);
    showEl(gameOverEl);
  } else if (s == "main-menu") {
    hideEl(scoreEl, gameOverEl);
    showEl(mainMenuEl);
  }
});

const initBird: Bird = {
  y: MAX_HEIGHT / 2,
  fallSpeed: 0,
  ySpeed: 0
};

const createBird$ = () =>
  combineLatest(of(initBird), input$, scene$, clock$).pipe(
    map(([bird, input, scene]) => {
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

const bird$ = fromEvent(startGameBtn, "click").pipe(
  switchMapTo(createBird$()),
  startWith(initBird)
);

const createPipe = (id: number): Pipe => ({
  id: id,
  distance: 300,
  gapPosition: Math.floor(Math.random() * (MAX_HEIGHT - 30)) + 15
});

const createPipe$ = () =>
  interval(4000).pipe(
    scan<any, Pipe[]>((acc, val) => [...acc, createPipe(val)], []),
    combineLatestOperator(clock$),
    map(([pipes]) => {
      pipes.forEach(p => (p.distance -= PIPE_SPEED));
      return pipes.filter(p => p.distance > -10).slice(0, 7);
    }),
    startWith([])
  );

const pipes$ = fromEvent(startGameBtn, "click").pipe(
  switchMapTo(createPipe$()),
  startWith<Pipe[]>([])
);

/**
 * An observable of GameStates
 */
const game$ = clock$.pipe(
  withLatestFrom(scene$, bird$, pipes$),
  map<any, GameState>(([clock, scene, bird, pipes]) => ({
    scene: scene,
    bird: bird,
    pipes: pipes
  })),
  tap(state => {
    if (state["bird"].y <= 0 && state["scene"] == "game") {
      scene$.next("game-over");
    }
  })
);

scene$.subscribe(console.log);

export { game$ };
