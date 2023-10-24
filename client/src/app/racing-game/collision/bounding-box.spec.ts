import { BoundingBox } from "./bounding-box";
import { Object3D } from "three";

describe("BoundingBox", () => {
  const mesh1: Object3D = new Object3D();
  const boundingBox1: BoundingBox = new BoundingBox();
  const mesh2: Object3D = new Object3D();
  const boundingBox2: BoundingBox = new BoundingBox();
  boundingBox1.init(mesh1);
  boundingBox2.init(mesh2);
  it("carA should collide with carB", () => {
    mesh1.position.set(0, 0, 0);
    mesh2.position.set(0, 0, 0);
    boundingBox1.update();
    boundingBox2.update();
    expect(boundingBox1.checkCollision(boundingBox2)).toEqual(true);
  });
  it("carA should not collide with carB", () => {
    mesh1.position.set(-1, -1, -1);
    mesh2.position.set(1, 1, 1);
    boundingBox1.update();
    boundingBox2.update();
    expect(boundingBox1.checkCollision(boundingBox2)).toEqual(false);
  });
});
