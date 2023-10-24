import { TestBed, inject } from "@angular/core/testing";

import { TrackCreatorService } from "./trackCreator.service";

import { Track } from "./track";
import { Point } from "./point";
// tslint:disable:no-magic-numbers
describe("TrackCreatorService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [TrackCreatorService]
        });
    });

    it("should be created", inject([TrackCreatorService], (service: TrackCreatorService) => {
        expect(service).toBeTruthy();
    }));
    describe("getPoints", () => {
        it("should return the size of the array ", () => {
            const track: Track = new Track();
            const points: Point[] = [
                new Point(), new Point(), new Point(), new Point()
            ];
            for (const point of points) {
                track.getPoints().push(point);
            }
            expect(track.getPoints().length).toBe(4);
        });
    });
    describe("PointPosition", () => {
        it("should return dot position in X axis ", () => {
           const dot: Point = new Point();
           dot.getPoint().position.x = 8;
           const posX: number = dot.getPoint().position.x;
           expect(posX).toBe(8);
        });
        it("should return dot position in Y axis ",  () => {
            const dot: Point = new Point();
            dot.getPoint().position.y = 2;
            const posY: number = dot.getPoint().position.y;
            expect(posY).toBe(2);
         });
        it("should return dot position in Z axis ",  () => {
            const dot: Point = new Point();
            dot.getPoint().position.z = 15;
            const posZ: number = dot.getPoint().position.z;
            expect(posZ).toBe(15);
         });
    });
});
