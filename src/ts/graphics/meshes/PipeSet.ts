import * as THREE from "three";

const createCap = (capHeight: number, material: THREE.MeshPhongMaterial) => {
  let outerRadius = 5;
  let innerRadius = 3;

  let arcShape = new THREE.Shape();
  arcShape.moveTo(outerRadius * 2, outerRadius);
  arcShape.absarc(outerRadius, outerRadius, outerRadius, 0, Math.PI * 2, false);
  let holePath = new THREE.Path();
  holePath.moveTo(outerRadius + innerRadius, outerRadius);
  holePath.absarc(outerRadius, outerRadius, innerRadius, 0, Math.PI * 2, true);
  arcShape.holes.push(holePath);

  let geometry = new THREE.ExtrudeBufferGeometry(arcShape, {
    depth: capHeight,
    bevelEnabled: false,
    steps: 1,
    curveSegments: 60
  });
  geometry.center();
  geometry.rotateX(Math.PI * -0.5);
  let mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

const createCylinder = (height: number, material: THREE.MeshPhongMaterial) => {
  let geometry = new THREE.CylinderBufferGeometry(4, 4, height, 32);
  let cylinder = new THREE.Mesh(geometry, material);
  return cylinder;
};

export class PipeSet extends THREE.Group {
  height: number;
  topCylHeight: number;
  bottomCylHeight: number;
  topCyl: THREE.Mesh;
  topCap: THREE.Mesh;
  bottomCyl: THREE.Mesh;
  bottomCap: THREE.Mesh;
  capHeight = 3;

  constructor(height: number, gapHeight: number, gapPosition: number) {
    super();

    this.height = height;

    const material = new THREE.MeshPhongMaterial({
      color: 0x04dd37
    });

    const cyl = (cylHeight: number) => createCylinder(cylHeight, material);
    const cap = () => createCap(this.capHeight, material);

    const halfGap = gapHeight / 2;

    const topHeight = height - (gapPosition + halfGap);
    this.topCylHeight = topHeight - this.capHeight;
    this.topCap = cap();
    this.topCyl = cyl(this.topCylHeight);
    this.topCap.position.setY(gapPosition + this.capHeight + halfGap);
    this.topCyl.position.setY(
      this.capHeight + gapPosition + halfGap + topHeight / 2
    );

    const bottomHeight = gapPosition - halfGap;
    this.bottomCylHeight = bottomHeight - this.capHeight;
    this.bottomCap = cap();
    this.bottomCyl = cyl(this.bottomCylHeight);
    this.bottomCap.position.setY(bottomHeight - this.capHeight / 2);
    this.bottomCyl.position.setY(this.bottomCylHeight / 2);

    this.add(this.topCap, this.topCyl);
    this.add(this.bottomCap, this.bottomCyl);
  }

  adjustPipes(gapHeight: number, gapPosition: number) {
    const halfGap = gapHeight / 2;

    const topHeight = this.height - (gapPosition + halfGap);
    const topCylHeight = topHeight - this.capHeight;
    const topScale = topCylHeight / this.topCylHeight;
    this.topCyl.scale.setY(topScale);

    this.topCap.position.setY(gapPosition + this.capHeight + halfGap);
    this.topCyl.position.setY(
      this.capHeight + gapPosition + halfGap + topHeight / 2
    );

    const bottomHeight = gapPosition - halfGap;
    const bottomCylHeight = bottomHeight - this.capHeight;
    const bottomScale = bottomCylHeight / this.bottomCylHeight;
    this.bottomCyl.scale.setY(bottomScale);

    this.bottomCap.position.setY(bottomHeight - this.capHeight / 2);
    this.bottomCyl.position.setY(bottomCylHeight / 2);
  }
}
