import * as THREE from "three";
import "three-examples/controls/OrbitControls";
import { GameState } from "../game/models/GameState";
import { Pipe } from "./meshes/Pipe";
import { World } from "./meshes/World";
import { Bird } from "./meshes/Bird";

const renderer = new THREE.WebGLRenderer({ antialias: false });
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

let pipeBuffer: Pipe[] = [];
for (let i = 0; i < 7; i++) pipeBuffer.push(new Pipe(10));
pipeBuffer.forEach(p => {
  p.visible = false;
  scene.add(p);
}, this);

const renderGameState = (state: GameState) => {
  if (state["scene"] == "game") {
    bird.position.y = state["bird"].y;
    pipeBuffer.forEach((p, i) => {
      if (i < state["pipes"].length - 1) {
        p.position.x = state["pipes"][i].distance;
        p.visible = true;
      } else {
        p.visible = false;
      }
    }, this);
  }

  controls.update();
  renderer.render(scene, camera);
};

export { renderGameState };
