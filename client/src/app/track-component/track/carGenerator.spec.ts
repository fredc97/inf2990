import { CarGenerator } from "./carGenerator";
import { Vector3, BoxGeometry } from "three";

// tslint:disable:no-magic-numbers
describe("carGenerator", () => {
    describe("shuffleCarPositions", () => {
        it("should return if the table is different from the original table ", () => {
            let compteur: number = 0;
            const geometries: BoxGeometry[] = [];
            const generator: CarGenerator =  new CarGenerator(geometries);
            const position: Vector3[] = new Array <Vector3>();
            position.push(new Vector3(0, 1, 3));
            position.push(new Vector3(4, 5, 6));
            const positionTemp: Vector3[] = new Array <Vector3>();
            position.push(new Vector3(0, 1, 3));
            position.push(new Vector3(4, 5, 6));
            for (let i: number = 0; i < 50; i++) {
                const newPosition: Vector3[] = generator.shuffleCarPositions(position);
                if (newPosition[0] !== positionTemp[0]) {
                    compteur++;
                }
            }
            expect(compteur).not.toEqual(0);
        });
    });
});
