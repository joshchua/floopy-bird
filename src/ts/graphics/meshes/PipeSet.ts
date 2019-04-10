import * as THREE from "three";
import { Pipe } from "./Pipe";

export class PipeSet extends THREE.Group {
  height: number;
  topPipe: Pipe;
  bottomPipe: Pipe;

  constructor(height: number, gapHeight: number, gapPosition: number) {
    super();
    this.height = height;
    const topPipeHeight = height - (gapPosition + (gapHeight / 2));
    const bottomPipeHeight = gapPosition - (gapHeight / 2);

    this.topPipe = new Pipe(topPipeHeight);
    const flip = new THREE.Matrix4().makeScale(1,-1,1);
    this.topPipe.applyMatrix(flip);
    this.topPipe.translateY(-height);
    this.bottomPipe = new Pipe(bottomPipeHeight);
    this.bottomPipe.changeHeight(12);
    this.add( this.bottomPipe);
  }

  adjustPipes(gapHeight: number, gapPosition: number) {

  }
}
