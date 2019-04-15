import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  DirectionalLight,
  AmbientLight,
  Vector3
} from "three";
//import "three-examples/controls/OrbitControls";
import * as TWEEN from "@tweenjs/tween.js";
import { GameState } from "../game/models/GameState";
import { World } from "./meshes/World";
import { PipeSet } from "./meshes/PipeSet";
import { Bird } from "./meshes/Bird";
import {
  MAX_HEIGHT,
  BIRD_WIDTH,
  GAP_HEIGHT,
  MAX_PIPES
} from "../utils/constants";

const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new Scene();
renderer.setClearColor(0x000000, 0);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//let controls = new THREE.OrbitControls(camera, renderer.domElement);

const directionalLight = new DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 70, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new AmbientLight(0x404040);
scene.add(ambientLight);

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

let world = new World();
scene.add(world);

const bird = new Bird(BIRD_WIDTH);
bird.position.y = 10;
scene.add(bird);

camera.position.z = 120;
camera.position.y = 50;
camera.lookAt(0, 50, 0);
//controls.update();

let availPipes: number[] = [];
let pipeMap = new Map<number, number>();
let pipes: PipeSet[] = [];
for (let i = 0; i < MAX_PIPES; i++) {
  let p = new PipeSet(MAX_HEIGHT, GAP_HEIGHT, 50);
  p.visible = false;
  pipes.push(p);
  scene.add(p);
  availPipes.push(i);
}

let prevScene: string = "main-menu";

const renderGameState = (state: GameState) => {
  if (state["scene"] != prevScene) {
    if (state["scene"] == "game-over") {
      new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 50, z: 120 }, 1000)
        .onStart(() => (bird.visible = true))
        .start();

      new TWEEN.Tween(camera.rotation)
        .to(
          {
            y: 0
          },
          1000
        )
        .start();
    } else if (state["scene"] == "transition") {
      new TWEEN.Tween(camera.position)
        .to(
          {
            x: 0,
            y: 50,
            z: 0
          },
          1000
        )
        .start();

      new TWEEN.Tween(camera.rotation)
        .to(
          {
            y: -Math.PI / 2
          },
          1000
        )
        .onComplete(() => (bird.visible = false))
        .start();
    }

    prevScene = state["scene"];
  }

  if (state["scene"] == "game") {
    let pos = new Vector3();
    pos.setFromMatrixPosition(bird.matrixWorld);
    camera.position.set(pos.x, pos.y, pos.z);
    camera.lookAt(pos.z + 100, pos.y, 0);
  }

  bird.position.y = state["bird"].y;
  pipeMap.forEach((val, key) => {
    if (state["pipes"].filter(p => p.id == key).length == 0) {
      availPipes.push(val);
      pipes[val].visible = false;
      pipeMap.delete(key);
    }
  }, this);
  state["pipes"].forEach(p => {
    if (pipeMap.has(p.id)) {
      pipes[pipeMap.get(p.id)].position.x = p.distance;
    }

    if (!pipeMap.has(p.id) && availPipes.length > 0) {
      let meshIndex = availPipes.pop();
      pipeMap.set(p.id, meshIndex);
      pipes[meshIndex].position.x = p.distance;
      pipes[meshIndex].adjustPipes(30, p.gapPosition);
      pipes[meshIndex].visible = true;
    }
  }, this);

  //controls.update();
  renderer.render(scene, camera);
  TWEEN.update();
};

export { renderGameState };
