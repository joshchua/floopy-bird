import {
  interval,
  animationFrameScheduler,
  fromEvent,
  merge,
  of,
  combineLatest,
  BehaviorSubject
} from "rxjs";
import {
  scan,
  map,
  startWith,
  combineLatest as combineLatestOperator,
  tap,
  withLatestFrom,
  switchMapTo,
  filter,
  distinctUntilChanged,
  share,
  delay,
  mapTo,
  merge as mergeOperator
} from "rxjs/operators";

import { Tick } from "./models/Tick";
import { InputState } from "./models/InputState";
import { GameState } from "./models/GameState";
import { Bird } from "./models/Bird";
import { Pipe } from "./models/Pipe";
import {
  MAX_HEIGHT,
  PIPE_SPEED,
  PIPE_WIDTH,
  BIRD_WIDTH,
  BIRD_HEIGHT,
  GAP_HEIGHT,
  MAX_PIPES,
  PIPE_START_DIST
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

/**
 * Redirect to GitHub repo
 */
fromEvent(githubBtn, "click").subscribe(
  () => (window.location.href = "https://github.com/joshchua/floopy-bird")
);

/**
 * The game clock that emits Tick objects on the animationFrameScheduler.
 */
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
/**
 * Convert milliseconds to seconds
 * @param ms Milliseconds
 */
const msToS = (ms: number) => 0.001 * ms;

/**
 * Emits booleans representing keydowns and keyups. Filters keys that are held down.
 */
const keyboardInput$ = merge(
  fromEvent(document, "keydown"),
  fromEvent(document, "keyup")
).pipe(
  filter(
    (() => {
      let keysPressed = {};
      return (e: KeyboardEvent) => {
        let k = e.key || e.which;
        if (e.type == "keyup") {
          delete keysPressed[k];
          return true;
        } else if (e.type == "keydown") {
          if (keysPressed[k]) return false;
          else {
            keysPressed[k] = true;
            return true;
          }
        }
      };
    })()
  ),
  map(e => e.type == "keydown"),
  mergeOperator(clock$.pipe(mapTo(false)))
);

/**
 * Emit boolean when mouse is clicked.
 */
const mouseInput$ = fromEvent(document, "click").pipe(mapTo(true));

/**
 * Merge mouse and keyboard input with a mapped clock$, to ensure each emission from mouse and keyboard are followed after a false.
 */
const input$ = merge(keyboardInput$, mouseInput$, keyboardInput$).pipe(
  distinctUntilChanged(),
  startWith(false),
  map<boolean, InputState>(b => ({ pressed: b }))
);

const scene$ = new BehaviorSubject("main-menu");

const newGame$ = scene$.pipe(filter(s => s == "game", distinctUntilChanged()));

merge(
  fromEvent(startGameBtn, "click").pipe(
    switchMapTo(merge(of("transition"), of("game").pipe(delay(2000))))
  ),
  fromEvent(playAgainBtn, "click").pipe(map(() => "main-menu"))
).subscribe(scene$);

const hideEl = (...el: Element[]) => el.forEach(e => e.classList.add("hidden"));
const showEl = (...el: Element[]) =>
  el.forEach(e => e.classList.remove("hidden"));

scene$.subscribe(s => {
  if (s == "game" || s == "transition") {
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

const updateBird = (bird: Bird, input: InputState, scene: string) => {
  if (scene == "main-menu" || scene == "transition") {
    bird.y = MAX_HEIGHT / 2;
    bird.ySpeed = 0;
    bird.fallSpeed = 0;
    return bird;
  }

  if (input.pressed == true && scene == "game") {
    bird.fallSpeed = 0;
    bird.ySpeed = -0.8;
  }

  if (scene == "game") {
    bird.fallSpeed += 0.04;
    const dy = -(bird.fallSpeed + bird.ySpeed);
    if (
      (bird.y <= BIRD_HEIGHT / 2 && dy < 0) ||
      (bird.y >= MAX_HEIGHT && dy > 0)
    )
      return bird;

    bird.y += dy;
  }

  return bird;
};

const bird$ = combineLatest(of(initBird), input$, scene$, clock$).pipe(
  map(([bird, input, scene]) => updateBird(bird, input, scene))
);

const createPipe = (id: number): Pipe => ({
  id: id,
  distance: PIPE_START_DIST,
  gapPosition:
    Math.floor(Math.random() * (MAX_HEIGHT - 0.4 * MAX_HEIGHT)) +
    (0.4 * MAX_HEIGHT) / 2
});

const updatePipe = (pipes: Pipe[], clock: Tick, scene: string) => {
  let current = pipes
    .filter(p => p.distance > -PIPE_START_DIST)
    .slice(0, MAX_PIPES);

  if (scene == "main-menu" || scene == "transition")
    return current.filter(() => false);

  if (scene == "game-over")
    return current.filter(p => p.distance < PIPE_START_DIST);

  current.forEach(p => (p.distance -= PIPE_SPEED * msToS(clock.delta)));
  return current;
};

/**
 * Create a new pipe$ observable.
 */
const createPipe$ = () =>
  interval(1500).pipe(
    scan<any, Pipe[]>((acc, val) => [...acc, createPipe(val)], []),
    combineLatestOperator(clock$, scene$),
    map(([pipes, clock, scene]) => updatePipe(pipes, clock, scene)),
    startWith([])
  );

const pipes$ = newGame$.pipe(
  switchMapTo(createPipe$()),
  startWith<Pipe[]>([])
);

const calcScore = (pipes: Pipe[]) => {
  if (pipes.length > 0) {
    const near = pipes.filter(p => p.distance > -10);
    return near[0].distance < 0 ? near[0].id + 1 : near[0].id;
  } else {
    return 0;
  }
};

const checkGameOver = (state: GameState) => {
  const gameOver = () => scene$.next("game-over");

  if (state["pipes"].length > 0 && state["scene"] == "game") {
    const p = state["pipes"].filter(p => p.distance > -10)[0];
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
    // For 2.5D play
    //const bird = birdBoundingBox(BIRD_WIDTH, BIRD_HEIGHT, b.y);

    // For 3D play
    const bird = birdBoundingBox(BIRD_WIDTH / 2, BIRD_HEIGHT / 2, b.y);

    if (
      detectAABBCollisionByBox(bird, top) ||
      detectAABBCollisionByBox(bird, bottom)
    )
      gameOver();
  }

  if (state["bird"].y <= BIRD_HEIGHT / 2 && state["scene"] == "game")
    gameOver();
};

/**
 * An observable of GameStates that updates with every frame of requestAnimationFrame.
 */
const game$ = clock$.pipe(
  withLatestFrom(scene$, bird$, pipes$),
  map<any, GameState>(([clock, scene, bird, pipes]) => ({
    scene: scene,
    bird: bird,
    pipes: pipes,
    score: scene == "main-menu" ? 0 : calcScore(pipes)
  })),
  tap(checkGameOver),
  share()
);
/**
 * Update score DOM elements with the latest score.
 */
game$
  .pipe(
    map(g => g.score),
    distinctUntilChanged()
  )
  .subscribe(s => {
    scoreDisplays.forEach(d => (d.innerHTML = s.toString()));
  });

export { game$ };
