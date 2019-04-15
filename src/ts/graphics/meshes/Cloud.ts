import {
  Group,
  Geometry,
  SphereGeometry,
  Mesh,
  MeshLambertMaterial,
  Vector3,
  BufferGeometry
} from "three";

export class Cloud extends Group {
  constructor(
    tuftRadius: number,
    tuftTranslation: number,
    jitterDistance: number
  ) {
    super();

    const geo = new Geometry();

    const tuft1 = new SphereGeometry(tuftRadius, 7, 8);
    tuft1.translate(-tuftTranslation, 0, 0);
    geo.merge(tuft1);

    const tuft2 = new SphereGeometry(tuftRadius, 7, 8);
    tuft2.translate(tuftTranslation, 0, 0);
    geo.merge(tuft2);

    const tuft3 = new SphereGeometry(tuftRadius, 7, 8);
    tuft3.translate(0, 0, 0);
    geo.merge(tuft3);

    const map = (
      val: number,
      smin: number,
      smax: number,
      emin: number,
      emax: number
    ) => ((emax - emin) * (val - smin)) / (smax - smin) + emin;
    //randomly displace the x,y,z coords by the `per` value
    const jitter = (geo: Geometry, per: number) =>
      geo.vertices.forEach(v => {
        v.x += map(Math.random(), 0, 1, -per, per);
        v.y += map(Math.random(), 0, 1, -per, per);
        v.z += map(Math.random(), 0, 1, -per, per);
      });

    jitter(geo, jitterDistance);

    const chopBottom = (geo: Geometry, bottom: number) =>
      geo.vertices.forEach((v: Vector3) => (v.y = Math.max(v.y, bottom)));
    chopBottom(geo, -0.5);

    const bufferGeometry = new BufferGeometry().fromGeometry(geo);

    let cloud = new Mesh(
      bufferGeometry,
      new MeshLambertMaterial({
        color: "white",
        flatShading: true
      })
    );

    this.add(cloud);
  }
}
