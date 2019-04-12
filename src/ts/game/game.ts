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
  switchMapTo,
  filter,
  distinctUntilChanged
} from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";
import { GameState } from "./models/GameState";
import { Bird } from "./models/Bird";
import { Pipe } from "./models/Pipe";
import { BoundingBox } from "./models/BoundingBox";
import {
  MAX_HEIGHT,
  PIPE_SPEED,
  PIPE_WIDTH,
  BIRD_WIDTH,
  BIRD_HEIGHT,
  GAP_HEIGHT
} from "../utils/constants";
import {
  detectAABBCollisionByBox,
  topPipeBoundingBox,
  bottomPipeBoundingBox,
  birdBoundingBox
} from "../utils/collision";

import {
  mainMenuDiv,
  gameOverDiv,
  hudDiv,
  startGameBtn,
  playAgainBtn,
  githubBtn,
  scoreDisplays
} from "./domElements";

fromEvent(githubBtn, "click").subscribe(
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

const mstoS = (ms: number) => 0.001 * ms;

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

const newGame$ = scene$.pipe(filter(s => s == "main-menu"));

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
    hideEl(mainMenuDiv, gameOverDiv);
    showEl(hudDiv);
  } else if (s == "game-over") {
    hideEl(mainMenuDiv, hudDiv);
    showEl(gameOverDiv);
  } else if (s == "main-menu") {
    hideEl(hudDiv, gameOverDiv);
    showEl(mainMenuDiv);
  }
});

const initBird: Bird = {
  y: MAX_HEIGHT / 2,
  fallSpeed: 0,
  ySpeed: 0
};

const bird$ = combineLatest(of(initBird), input$, scene$, clock$).pipe(
  map(([bird, input, scene, clock]) => {
    if (scene == "main-menu") {
      bird.y = MAX_HEIGHT / 2;
      bird.ySpeed = 0;
      bird.fallSpeed = 0;
      return bird;
    }
    if (input.pressed == true) {
      bird.fallSpeed = 0;
      bird.ySpeed = -10;
    }

    bird.fallSpeed += 0.5;
    const dy = -(bird.fallSpeed + bird.ySpeed) * mstoS(clock.delta);

    if ((bird.y <= 0 && dy < 0) || (bird.y >= MAX_HEIGHT && dy > 0))
      return bird;

    bird.y += dy;

    return bird;
  })
);

const createPipe = (id: number): Pipe => ({
  id: id,
  distance: 100,
  gapPosition: Math.floor(Math.random() * (MAX_HEIGHT - 30)) + 15
});

const createPipe$ = () =>
  interval(1500).pipe(
    scan<any, Pipe[]>((acc, val) => [...acc, createPipe(val)], []),
    combineLatestOperator(clock$),
    map(([pipes, clock]) => {
      pipes.forEach(p => (p.distance -= PIPE_SPEED * mstoS(clock.delta)));
      return pipes.filter(p => p.distance > -10).slice(0, 7);
    }),
    startWith([])
  );

const pipes$ = newGame$.pipe(
  switchMapTo(createPipe$()),
  startWith<Pipe[]>([])
);

const score$ = combineLatest(of(0), bird$, pipes$, scene$).pipe(
  map<any, number>(([score, bird$, pipes, scene]) => {
    if (scene == "main-menu") score = 0;

    if (scene == "game" && pipes.length > 0) {
      if (pipes[0].distance == 0) score++;
    }

    return score;
  }),
  distinctUntilChanged()
);

score$.subscribe(s => {
  scoreDisplays.forEach(d => d.innerHTML = s.toString())
  console.log(s);
});

/**
 * An observable of GameStates
 */
const game$ = clock$.pipe(
  withLatestFrom(scene$, bird$, pipes$, score$),
  map<any, GameState>(([clock, scene, bird, pipes, score]) => ({
    scene: scene,
    bird: bird,
    pipes: pipes,
    score: score
  })),
  tap(state => {
    const gameOver = () => scene$.next("game-over");

    if (state["pipes"].length > 0 && state["scene"] == "game") {
      const p = state["pipes"][0];
      const top = topPipeBoundingBox(
        p.gapPosition,
        p.distance,
        PIPE_WIDTH,
        GAP_HEIGHT,
        MAX_HEIGHT
      );
      const bottom = bottomPipeBoundingBox(
        p.gapPosition,
        p.distance,
        PIPE_WIDTH,
        GAP_HEIGHT
      );
      const b = state["bird"];
      const bird = birdBoundingBox(BIRD_WIDTH, BIRD_HEIGHT, b.y);

      if (
        detectAABBCollisionByBox(bird, top) ||
        detectAABBCollisionByBox(bird, bottom)
      )
        gameOver();
    }

    if (state["bird"].y <= 0 && state["scene"] == "game") gameOver();
  })
);

export { game$ };
