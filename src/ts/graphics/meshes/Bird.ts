import * as THREE from "three";

const createCube = (size: number): THREE.BoxGeometry => {
  let geometry = new THREE.BoxGeometry(size, size, size);
  return geometry;
};

const createPixelArtCell = (
  size: number,
  x: number,
  y: number
): THREE.BoxGeometry => {
  let cell = createCube(size);
  cell.translate(x * size, y * size, 0);
  return cell;
};

const createPixelArtMesh = (
  cells: THREE.BoxGeometry[],
  color: number
): THREE.Mesh => {
  let geometry = new THREE.Geometry();
  cells.forEach(cell => geometry.merge(cell), this);
  geometry.mergeVertices();
  const material = new THREE.MeshLambertMaterial({ color: color });
  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);
  return new THREE.Mesh(bufferGeometry, material);
};

export class Bird extends THREE.Group {
  constructor(width: number) {
    super();

    const cellSize = width / 17;
    const cell = (x: number, y: number) => createPixelArtCell(cellSize, x, y);

    let blackMesh = createPixelArtMesh(
      [
        cell(9, 1),
        cell(9, -1),
        cell(9, 5),
        cell(8, 4),
        cell(8, 3),
        cell(8, 2),
        cell(5, -5),
        cell(6, -5),
        cell(7, -5),
        cell(8, -5),
        cell(4, -4),
        cell(3, -4),
        cell(2, -3),
        cell(2, -2),
        cell(3, -2),
        cell(4, -2),
        cell(5, -1),
        cell(6, 1),
        cell(6, 0),
        cell(5, 2),
        cell(1, -1),
        cell(0, 0),
        cell(0, 1),
        cell(0, 2),
        cell(1, 3),
        cell(2, 3),
        cell(3, 3),
        cell(4, 3),
        cell(3, 4),
        cell(4, 5),
        cell(5, 5),
        cell(6, 6),
        cell(7, 6),
        cell(8, 6),
        cell(9, 6),
        cell(10, 6),
        cell(11, 6),
        cell(12, 5),
        cell(13, 4),
        cell(14, 3),
        cell(14, 2),
        cell(14, 1),
        cell(14, 0),
        cell(15, 0),
        cell(16, -1),
        cell(15, -2),
        cell(14, -2),
        cell(13, -2),
        cell(12, -2),
        cell(11, -2),
        cell(15, -3),
        cell(14, -4),
        cell(13, -4),
        cell(12, -4),
        cell(11, -4),
        cell(10, -4),
        cell(9, -3),
        cell(8, -2),
        cell(9, -1),
        cell(9, -5),
        cell(10, 0),
        cell(11, 0),
        cell(12, 0),
        cell(13, 0),
        cell(12, 2),
        cell(12, 3)
      ],
      0x000000
    );

    let redMesh = createPixelArtMesh(
      [
        cell(9, -2),
        cell(10, -2),
        cell(10, -1),
        cell(11, -1),
        cell(12, -1),
        cell(13, -1),
        cell(14, -1),
        cell(15, -1),
        cell(10, -3),
        cell(11, -3),
        cell(12, -3),
        cell(13, -3),
        cell(14, -3)
      ],
      0xFF6AD5
    );

    let orangeMesh = createPixelArtMesh(
      [
        cell(3, -3),
        cell(4, -3),
        cell(5, -3),
        cell(5, -4),
        cell(5, -2),
        cell(6, -4),
        cell(6, -2),
        cell(6, -3),
        cell(7, -2),
        cell(7, -3),
        cell(7, -4),
        cell(8, -4),
        cell(8, -3),
        cell(9, -4)
      ],
      0x8795E8
    );

    let yellowMesh = createPixelArtMesh(
      [
        cell(1, 0),
        cell(2, -1),
        cell(3, -1),
        cell(4, -1),
        cell(5, 0),
        cell(5, 3),
        cell(6, 4),
        cell(7, 4),
        cell(6, 3),
        cell(7, 3),
        cell(6, 2),
        cell(7, 2),
        cell(6, -1),
        cell(7, -1),
        cell(8, -1),
        cell(8, 0),
        cell(7, 0),
        cell(7, 1),
        cell(8, 1),
        cell(9, 0)
      ],
      0x94D0FF
    );

    let whiteMesh = createPixelArtMesh(
      [
        cell(1, 1),
        cell(1, 2),
        cell(2, 1),
        cell(2, 2),
        cell(2, 0),
        cell(3, 0),
        cell(3, 1),
        cell(3, 2),
        cell(4, 0),
        cell(4, 1),
        cell(4, 2),
        cell(5, 1),
        cell(5, 4),
        cell(4, 4),
        cell(6, 5),
        cell(7, 5),
        cell(8, 5),
        cell(10, 1),
        cell(11, 1),
        cell(12, 1),
        cell(13, 1),
        cell(13, 2),
        cell(13, 3),
        cell(9, 2),
        cell(10, 2),
        cell(11, 2),
        cell(9, 3),
        cell(10, 3),
        cell(11, 3),
        cell(9, 4),
        cell(10, 4),
        cell(11, 4),
        cell(12, 4),
        cell(10, 5),
        cell(11, 5)
      ],
      0xffffff
    );

    this.add(blackMesh, redMesh, orangeMesh, yellowMesh, whiteMesh);
    this.translateX(-(cellSize * 8.5));
    this.translateY(0.5 * cellSize);
  }
}
