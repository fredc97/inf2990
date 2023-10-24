import { ThirdPersonCamera } from "./third-person-camera";
import { Object3D, Vector3 } from "three";

describe("Game Camera", () => {
    const object: Object3D = new Object3D();
    object.position.set(0, 0, 0);
    // tslint:disable-next-line:no-magic-numbers (simulating a standard resolution)
    const camera: ThirdPersonCamera = new ThirdPersonCamera(object, 800, 600);
    camera.init();
    object.position.set(1, 0, 1);

    it("should be created", () => {
        expect(camera).toBeTruthy();
    });

    describe("Testing third person view camera", () => {
        it("camera x position shouldn't change. (referentiel = parent)", () => {
            const position: Vector3 = camera.position.clone();
            object.position.set(-1, -1, -1);
            expect(camera.position.x).toEqual(position.x);
        });
        it("camera y position shouldn't change. (referentiel = parent)", () => {
            const position: Vector3 = camera.position.clone();
            object.position.set(-1, -1, -1);
            expect(camera.position.y).toEqual(position.y);
        });
        it("camera z position shouldn't change. (referentiel = parent)", () => {
            const position: Vector3 = camera.position.clone();
            object.position.set(-1, -1, -1);
            expect(camera.position.z).toEqual(position.z);
        });
    });

    describe("Testing zoomIn", () => {
        it("camera (perspective) y and z positions should decrease", () => {
            const position: Vector3 = camera.position.clone();
            camera.zoomIn();
            expect(camera.position.y).toBeLessThan(position.y);
            expect(camera.position.z).toBeLessThan(position.z);
            expect(camera.position.x).toEqual(position.x);
        });
    });

    describe("Testing zoomOut", () => {
        it("camera (perspective) y and z positions should increase", () => {
            const position: Vector3 = camera.position.clone();
            camera.zoomOut();
            expect(camera.position.y).toBeGreaterThan(position.y);
            expect(camera.position.z).toBeGreaterThan(position.z);
            expect(camera.position.x).toEqual(position.x);
        });
    });
});
