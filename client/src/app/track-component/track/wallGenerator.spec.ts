import { WallGenerator } from "./wallGenerator";
import { BoxGeometry, Vector3 } from "three";
/* tslint:disable: no-magic-numbers */
describe("WallGenerator", () => {
    it("should be instantiated correctly using  constructor", () => {
        const geometries: BoxGeometry[] = [];
        geometries.push(new BoxGeometry(4, 0, 4));
        const wallGenerator: WallGenerator = new WallGenerator(geometries);
        expect(wallGenerator).toBeDefined();
    });
    it("should generate a wall", () => {
        const geometries: BoxGeometry[] = [];
        geometries.push(new BoxGeometry(4, 0, 4));
        const wallGenerator: WallGenerator = new WallGenerator(geometries);
        wallGenerator.generateWall();
        const expectedWallPostion: Vector3[] = [];
        expectedWallPostion.push(new Vector3(2, 0, -2));
        expectedWallPostion.push(new Vector3(-2, 0, 2));
        expect(wallGenerator.getLines()[0].vertices).toEqual(expectedWallPostion);
    });
});
