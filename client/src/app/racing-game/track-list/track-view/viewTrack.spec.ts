import { ViewTrackService } from "./viewTrack.service";
import { Vector3 } from "three";

/* tslint:disable: no-magic-numbers */

describe("viewTrack", () => {
    let viewTrack: ViewTrackService;

    it("should be instantiable using default constructor", () => {
        viewTrack = new ViewTrackService();
        expect(viewTrack).toBeDefined();
    });

    it("vector point should be updated", () => {
        const point: Vector3[] = [];
        point.push(new Vector3(0, 1, 1));
        point.push(new Vector3(5, 2, 4));
        viewTrack = new ViewTrackService();
        viewTrack.setTrack(point);
        expect(viewTrack.getTrackPoint().length).toEqual(2);
    });
});
