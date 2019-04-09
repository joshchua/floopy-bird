import * as THREE from "three";
import "three-examples/controls/OrbitControls";
import { GameState } from "../game/models/GameState";
import { Pipe } from "./meshes/Pipe";
import { World } from "./meshes/World";
import { Bird } from "./meshes/Bird";

const renderGame = () => {
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

  let axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  let controls = new THREE.OrbitControls(camera, renderer.domElement);

  // let gridHelper = new THREE.GridHelper(400, 40);
  // scene.add(gridHelper);

  let pipe = new Pipe(10);
  pipe.position.x = 30;
  scene.add(pipe);

  let bird = new Bird(15);
  bird.position.y = 10;
  scene.add(bird);

  let world = new World();
  scene.add(world);

  // const light = new THREE.DirectionalLight( 0xffffff, 0.7 );
  // light.position.set( 1, 10, 0 ).normalize();
  // scene.add( light );
  // scene.add(new THREE.AmbientLight(0xffffff,0.3))

  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(0, 100, 20);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  var ambientLight = new THREE.AmbientLight(0x404040);
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

  return (state: any) => {
    controls.update();
    renderer.render(scene, camera);

    if (state["scene"] == "main-menu") {
      bird.position.y = state["bird"].y;
    }
  };
};

export { renderGame };
