import * as THREE from "three";

export class Pipe extends THREE.Group {
  constructor(height: number) {
    super();

    let material = new THREE.MeshPhongMaterial({
      color: 0x04dd37
    });

    function createTop() {
      let outerRadius = 5;
      let innerRadius = 3;
      let topHeight = 3;

      let arcShape = new THREE.Shape();
      arcShape.moveTo(outerRadius * 2, outerRadius);
      arcShape.absarc(
        outerRadius,
        outerRadius,
        outerRadius,
        0,
        Math.PI * 2,
        false
      );
      let holePath = new THREE.Path();
      holePath.moveTo(outerRadius + innerRadius, outerRadius);
      holePath.absarc(
        outerRadius,
        outerRadius,
        innerRadius,
        0,
        Math.PI * 2,
        true
      );
      arcShape.holes.push(holePath);

      let geometry = new THREE.ExtrudeBufferGeometry(arcShape, {
        depth: topHeight,
        bevelEnabled: false,
        steps: 1,
        curveSegments: 60
      });
      geometry.center();
      geometry.rotateX(Math.PI * -0.5);
      let mesh = new THREE.Mesh(geometry, material);
      mesh.position.y += height;
      return mesh;
    }

    function createCylinder() {
      let geometry = new THREE.CylinderBufferGeometry(4, 4, height, 32);
      let cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.y += height / 2;
      return cylinder;
    }

    let top = createTop();
    let cyl = createCylinder();
    this.add(top, cyl);
  }
}
