import { BoundingBox } from "../game/models/BoundingBox";

/**
 * Find a Axis-Aligned Bounding Box collision.
 *
 * @param x1
 * @param y1
 * @param width1
 * @param height1
 * @param x2
 * @param y2
 * @param width2
 * @param height2
 */
const detectAABBCollision = (
  x1: number,
  y1: number,
  width1: number,
  height1: number,
  x2: number,
  y2: number,
  width2: number,
  height2: number
): boolean =>
  x1 < x2 + width2 &&
  x1 + width1 > x2 &&
  y1 < y2 + height2 &&
  y1 + height1 > y2;

const detectAABBCollisionByBox = (box1: BoundingBox, box2: BoundingBox) =>
  detectAABBCollision(
    box1.x,
    box1.y,
    box1.width,
    box1.height,
    box2.x,
    box2.y,
    box2.width,
    box2.height
  );

const topPipeBoundingBox = (
  gapPosition: number,
  distance: number,
  pipeWidth: number,
  gapHeight: number,
  maxHeight: number
): BoundingBox => ({
  x: distance - pipeWidth / 2,
  y: gapPosition + gapHeight / 2,
  width: pipeWidth,
  height: maxHeight - gapPosition - gapHeight / 2
});

const bottomPipeBoundingBox = (
  gapPosition: number,
  distance: number,
  pipeWidth: number,
  gapHeight: number
): BoundingBox => ({
  x: distance - pipeWidth / 2,
  y: 0,
  width: pipeWidth,
  height: gapPosition - gapHeight / 2
});

const birdBoundingBox = (
  width: number,
  height: number,
  position: number
): BoundingBox => ({
  x: 0 - width / 2,
  y: position - height / 2,
  height: height,
  width: width
});

export {
  detectAABBCollision,
  detectAABBCollisionByBox,
  topPipeBoundingBox,
  bottomPipeBoundingBox,
  birdBoundingBox
};
