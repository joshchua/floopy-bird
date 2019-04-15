import {
  Group,
  MeshLambertMaterial,
  SphereBufferGeometry,
  Mesh,
  CylinderBufferGeometry
} from "three";

export class Hill extends Group {
  constructor(radius: number, height: number, color: number) {
    super();

    const radialSegments = 32;
    var material = new MeshLambertMaterial({ color: color });

    var hemiSphereGeom = new SphereBufferGeometry(
      radius,
      radialSegments,
      Math.round(radialSegments / 4),
      0,
      Math.PI * 2,
      0,
      Math.PI * 0.5
    );
    var hemiSphere = new Mesh(hemiSphereGeom, material);

    const cylHeight = height - radius;
    hemiSphere.position.y += cylHeight;

    var cylGeom = new CylinderBufferGeometry(
      radius,
      radius,
      cylHeight,
      radialSegments
    );
    var cylinder = new Mesh(cylGeom, material);
    cylinder.position.y += cylHeight / 2;

    this.add(cylinder, hemiSphere);
  }
}
