import * as THREE from "three";
import { Hill } from "./Hill";
import { Cloud } from "./Cloud";
const Ground = require("../../../assets/textures/ground.png");

interface Position {
  x?: number;
  y?: number;
  z?: number;
}

function createPlane(width: number, length: number): THREE.Mesh {
  let texture = new THREE.TextureLoader().load(Ground);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.LinearMipMapLinearFilter;
  texture.repeat.set(20, 20);

  let geometry = new THREE.PlaneBufferGeometry(width, length, 32);
  let material = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    map: texture
  });
  let plane = new THREE.Mesh(geometry, material);
  plane.rotateX(Math.PI / 2);
  return plane;
}

interface HillProps {
  radius: number;
  height: number;
  color: number;
}

function createHill(props: HillProps, pos: Position): Hill {
  let hill = new Hill(props.radius, props.height, props.color);
  hill.position.x = pos.x;
  hill.position.z = pos.z;
  return hill;
}

interface MountainProps extends HillProps {}

function createMountain(props: MountainProps, pos: Position): THREE.Mesh {
  let geometry = new THREE.ConeBufferGeometry(props.radius, props.height, 32);
  let material = new THREE.MeshLambertMaterial({ color: props.color });
  let mountian = new THREE.Mesh(geometry, material);
  mountian.position.x = pos.x;
  mountian.position.z = pos.z;
  return mountian;
}

function createCloud(pos: Position): Cloud {
  let cloud = new Cloud(20, 18, 2);
  cloud.position.x = pos.x;
  cloud.position.y = pos.y;
  cloud.position.z = pos.z;
  return cloud;
}

export class World extends THREE.Group {
  constructor() {
    super();

    this.add(
      createPlane(400, 400),
      createHill(
        {
          radius: 20,
          height: 30,
          color: 0x287256
        },
        { x: 50, z: -100 }
      ),
      createHill(
        {
          radius: 15,
          height: 20,
          color: 0x287256
        },
        { x: 50, z: -80 }
      ),
      createHill(
        {
          radius: 15,
          height: 20,
          color: 0x287256
        },
        { x: -60, z: -75 }
      ),
      createHill(
        {
          radius: 18,
          height: 28,
          color: 0x287256
        },
        { x: -100, z: -100 }
      ),
      createHill(
        {
          radius: 18,
          height: 28,
          color: 0x287256
        },
        { x: -80, z: -50 }
      ),
      createHill(
        {
          radius: 18,
          height: 28,
          color: 0x287256
        },
        { x: 60, z: -40 }
      ),
      createCloud({ x: 50, y: 50, z: 50 })
    );
  }
}
