import * as THREE from "three";
import "three-examples/controls/OrbitControls";
import { GameState } from "../game/models/GameState";
import { World } from "./meshes/World";
import { PipeSet } from "./meshes/PipeSet";
import { Bird } from "./meshes/Bird";
import { pipe } from "rxjs";

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2cb9e8);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 100, 20);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

camera.position.z = 20;
camera.position.y = 30;
controls.update();

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

let axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

let world = new World();
scene.add(world);

const bird = new Bird(15);
bird.position.y = 10;
scene.add(bird);

let availPipes: number[] = [];
let pipeMap = new Map<number, number>();
let pipes: PipeSet[] = [];
for (let i = 0; i < 7; i++) {
  let p = new PipeSet(100, 30, 50);
  p.visible = false;
  pipes.push(p);
  scene.add(p);
  availPipes.push(i)
}

const renderGameState = (state: GameState) => {
  bird.position.y = state["bird"].y;
  if (state["scene"] == "game") {
    pipeMap.forEach((val, key) => {
      if (state["pipes"].filter(p => p.id == key).length == 0) {
        availPipes.push(val);
        pipes[val].visible = false;
        pipeMap.delete(key);
      }
    }, this);
    state["pipes"].forEach((p) => {
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
  }

  controls.update();
  renderer.render(scene, camera);
};

export { renderGameState };
