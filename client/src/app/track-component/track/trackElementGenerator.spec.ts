import { TrackElementsGenerator } from "./trackElementsGenerator";
// tslint:disable:no-magic-numbers

describe("TrackElementsGenerator", () => {
    it("should be instantiated correctly using default constructor", () => {
        const trackElementsGenerator: TrackElementsGenerator = new TrackElementsGenerator();
        expect(trackElementsGenerator).toBeDefined();
    });

});
