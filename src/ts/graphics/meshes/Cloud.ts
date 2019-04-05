import * as THREE from "three";

export class Cloud extends THREE.Group {
  constructor(
    tuftRadius: number,
    tuftTranslation: number,
    jitterDistance: number
  ) {
    super();

    const geo = new THREE.Geometry();

    const tuft1 = new THREE.SphereGeometry(tuftRadius, 7, 8);
    tuft1.translate(-tuftTranslation, 0, 0);
    geo.merge(tuft1);

    const tuft2 = new THREE.SphereGeometry(tuftRadius, 7, 8);
    tuft2.translate(tuftTranslation, 0, 0);
    geo.merge(tuft2);

    const tuft3 = new THREE.SphereGeometry(tuftRadius, 7, 8);
    tuft3.translate(0, 0, 0);
    geo.merge(tuft3);

    let cloud = new THREE.Mesh(
      geo,
      new THREE.MeshLambertMaterial({
        color: "white",
        flatShading: true
      })
    );

    const map = (
      val: number,
      smin: number,
      smax: number,
      emin: number,
      emax: number
    ) => ((emax - emin) * (val - smin)) / (smax - smin) + emin;
    //randomly displace the x,y,z coords by the `per` value
    const jitter = (geo: THREE.Geometry, per: number) =>
      geo.vertices.forEach(v => {
        v.x += map(Math.random(), 0, 1, -per, per);
        v.y += map(Math.random(), 0, 1, -per, per);
        v.z += map(Math.random(), 0, 1, -per, per);
      });

    jitter(geo, jitterDistance);

    const chopBottom = (geo: THREE.Geometry, bottom: number) =>
      geo.vertices.forEach((v: THREE.Vector3) => (v.y = Math.max(v.y, bottom)));
    chopBottom(geo, -0.5);

    this.add(cloud);
  }
}
