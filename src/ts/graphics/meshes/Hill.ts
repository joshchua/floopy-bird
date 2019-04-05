import * as THREE from "three";

export class Hill extends THREE.Group {
  constructor(radius, height: number, color: number) {
    super();

    const radialSegments = 32;
    var material = new THREE.MeshLambertMaterial({ color: color });

    var hemiSphereGeom = new THREE.SphereBufferGeometry(
      radius,
      radialSegments,
      Math.round(radialSegments / 4),
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5
    );
    var hemiSphere = new THREE.Mesh(hemiSphereGeom, material);

    const cylHeight = height - radius;
    hemiSphere.position.y += cylHeight;

    var cylGeom = new THREE.CylinderBufferGeometry(
      radius,
      radius,
      cylHeight,
      radialSegments
    );
    var cylinder = new THREE.Mesh(cylGeom, material);
    cylinder.position.y += cylHeight / 2;

    this.add(cylinder, hemiSphere);
  }
}
