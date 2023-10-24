
import { TrackGenerator } from "./trackGenerator";
import { BoxGeometry, Vector3, Mesh, Scene } from "three";
/* tslint:disable: no-magic-numbers */

describe("trackGenerator", () => {
    it("should be is differente texture", () => {
        const scene: Scene = new Scene();
        const geometries: BoxGeometry[] = [];
        geometries.push(new BoxGeometry(0, 0, 0));
        geometries.push(new BoxGeometry(1, 1, 1));
        const points: Vector3[] = [];
        points.push(new Vector3(0, 0, 0));
        points.push(new Vector3(1, 0, 1));
        points.push(new Vector3(2, 0, 2));
        const trackGenerator: TrackGenerator = new TrackGenerator(geometries);
        const meshTrack: Mesh[] = trackGenerator.generateTrack(points, 15);
        const plane: Mesh = trackGenerator.generatePlane(scene);
        expect(meshTrack[0].geometry.name !== plane.geometry.name).toBe(true);
    });
});
