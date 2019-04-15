import {
  TextureLoader,
  RepeatWrapping,
  NearestFilter,
  LinearMipMapLinearFilter,
  PlaneBufferGeometry,
  MeshLambertMaterial,
  DoubleSide,
  Mesh,
  ConeBufferGeometry,
  Group
} from "three";
import { Hill } from "./Hill";
import { Cloud } from "./Cloud";
const Ground = require("../../../assets/textures/ground.png");

interface Position {
  x?: number;
  y?: number;
  z?: number;
}

const createPlane = (width: number, length: number): Mesh => {
  let texture = new TextureLoader().load(Ground);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.magFilter = NearestFilter;
  texture.minFilter = LinearMipMapLinearFilter;
  texture.repeat.set(20, 20);

  let geometry = new PlaneBufferGeometry(width, length, 32);
  let material = new MeshLambertMaterial({
    color: 0xffffff,
    side: DoubleSide,
    map: texture
  });
  let plane = new Mesh(geometry, material);
  plane.rotateX(Math.PI / 2);
  return plane;
};

interface HillProps {
  radius: number;
  height: number;
  color: number;
}

const createHill = (props: HillProps, pos: Position): Hill => {
  let hill = new Hill(props.radius, props.height, props.color);
  hill.position.x = pos.x;
  hill.position.z = pos.z;
  return hill;
};

interface MountainProps extends HillProps {}

const createMountain = (props: MountainProps, pos: Position): Mesh => {
  let geometry = new ConeBufferGeometry(props.radius, props.height, 32);
  let material = new MeshLambertMaterial({ color: props.color });
  let mountian = new Mesh(geometry, material);
  mountian.position.x = pos.x;
  mountian.position.z = pos.z;
  mountian.position.y = props.height / 2;
  return mountian;
};

const createCloud = (pos: Position): Cloud => {
  let cloud = new Cloud(20, 18, 2);
  cloud.position.x = pos.x;
  cloud.position.y = pos.y;
  cloud.position.z = pos.z;
  return cloud;
};

export class World extends Group {
  constructor() {
    super();

    this.add(
      createPlane(700, 700),
      createHill(
        {
          radius: 20,
          height: 47,
          color: 0x6d6875
        },
        { x: 0, z: -50 }
      ),
      // First row of hills
      createHill(
        {
          radius: 20,
          height: 45,
          color: 0x6d6875
        },
        { x: 42, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 46,
          color: 0x6d6875
        },
        { x: -42, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 47,
          color: 0x6d6875
        },
        { x: 84, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 50,
          color: 0x6d6875
        },
        { x: -84, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 44,
          color: 0x6d6875
        },
        { x: 126, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 51,
          color: 0x6d6875
        },
        { x: -126, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 49,
          color: 0x6d6875
        },
        { x: 168, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 44,
          color: 0x6d6875
        },
        { x: -168, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 45,
          color: 0x6d6875
        },
        { x: 210, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 48,
          color: 0x6d6875
        },
        { x: -210, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 42,
          color: 0x6d6875
        },
        { x: 252, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 50,
          color: 0x6d6875
        },
        { x: -252, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 51,
          color: 0x6d6875
        },
        { x: 294, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 47,
          color: 0x6d6875
        },
        { x: -294, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 44,
          color: 0x6d6875
        },
        { x: 336, z: -50 }
      ),
      createHill(
        {
          radius: 20,
          height: 46,
          color: 0x6d6875
        },
        { x: -336, z: -50 }
      ),
      // Second row of hills
      createHill(
        {
          radius: 40,
          height: 70,
          color: 0xffcdb2
        },
        { x: 0, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 75,
          color: 0xb5838d
        },
        { x: 100, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 80,
          color: 0xb5838d
        },
        { x: -100, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 73,
          color: 0xffcdb2
        },
        { x: 200, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 77,
          color: 0xffcdb2
        },
        { x: -200, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 81,
          color: 0xb5838d
        },
        { x: 300, z: -120 }
      ),
      createHill(
        {
          radius: 40,
          height: 74,
          color: 0xb5838d
        },
        { x: -300, z: -120 }
      ),
      // Third row of hills
      createHill(
        {
          radius: 60,
          height: 120,
          color: 0xffb4a2
        },
        { x: 0, z: -230 }
      ),
      createHill(
        {
          radius: 60,
          height: 140,
          color: 0xe5989b
        },
        { x: 150, z: -230 }
      ),
      createHill(
        {
          radius: 60,
          height: 150,
          color: 0xe5989b
        },
        { x: -150, z: -230 }
      ),
      createHill(
        {
          radius: 60,
          height: 130,
          color: 0xffb4a2
        },
        { x: 300, z: -230 }
      ),
      createHill(
        {
          radius: 60,
          height: 170,
          color: 0xffb4a2
        },
        { x: -300, z: -230 }
      ),
      // First row of mountains
      createMountain(
        {
          radius: 10,
          height: 70,
          color: 0x403644
        },
        { x: 130, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 75,
          color: 0x403644
        },
        { x: -130, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 72,
          color: 0x1e1821
        },
        { x: 160, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 76,
          color: 0x1e1821
        },
        { x: -160, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 70,
          color: 0x403644
        },
        { x: 190, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 73,
          color: 0x403644
        },
        { x: -190, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 78,
          color: 0x1e1821
        },
        { x: 220, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 75,
          color: 0x1e1821
        },
        { x: -220, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 70,
          color: 0x403644
        },
        { x: 250, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 73,
          color: 0x403644
        },
        { x: -250, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 77,
          color: 0x1e1821
        },
        { x: 280, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 76,
          color: 0x1e1821
        },
        { x: -280, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 78,
          color: 0x403644
        },
        { x: 310, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 72,
          color: 0x403644
        },
        { x: -310, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 74,
          color: 0x1e1821
        },
        { x: 340, z: 40 }
      ),
      createMountain(
        {
          radius: 10,
          height: 72,
          color: 0x1e1821
        },
        { x: -340, z: 40 }
      ),
      // Second row of mountains
      createMountain(
        {
          radius: 20,
          height: 100,
          color: 0x403644
        },
        { x: 300, z: 70 }
      ),
      createMountain(
        {
          radius: 20,
          height: 100,
          color: 0x403644
        },
        { x: -300, z: 70 }
      ),
      createMountain(
        {
          radius: 30,
          height: 100,
          color: 0x403644
        },
        { x: 200, z: 80 }
      ),
      createMountain(
        {
          radius: 30,
          height: 100,
          color: 0x403644
        },
        { x: -200, z: 80 }
      ),
      // Third row of mountains
      createMountain(
        {
          radius: 30,
          height: 100,
          color: 0x1e1821
        },
        { x: 250, z: 120 }
      ),
      createMountain(
        {
          radius: 30,
          height: 100,
          color: 0x1e1821
        },
        { x: -250, z: 120 }
      ),
      createMountain(
        {
          radius: 60,
          height: 150,
          color: 0x1e1821
        },
        { x: 200, z: 200 }
      ),
      createMountain(
        {
          radius: 60,
          height: 150,
          color: 0x1e1821
        },
        { x: -200, z: 200 }
      ),
      createCloud({ x: 0, y: 100, z: -80 }),
      createCloud({ x: 150, y: 100, z: -80 }),
      createCloud({ x: -150, y: 100, z: -80 }),
      createCloud({ x: 170, y: 140, z: -150 }),
      createCloud({ x: -130, y: 140, z: -150 }),
      createCloud({ x: 200, y: 120, z: 80 }),
      createCloud({ x: -200, y: 120, z: 80 })
    );
  }
}
