import { TopViewCamera } from "./top-view-camera";
import { Object3D } from "three";

describe("Game Camera", () => {
    const object: Object3D = new Object3D();
    object.position.set(0, 0, 0);
    // tslint:disable-next-line:no-magic-numbers (simulating a standard resolution)
    const camera: TopViewCamera = new TopViewCamera(object, 800, 600);
    camera.init();
    object.position.set(1, 0, 1);
    camera.update();

    it("should be created", () => {
        expect(camera).toBeTruthy();
    });

    describe("Testing top view camera ", () => {
        it("camera x position should be equal to object x position", () => {
            expect(camera.position.x).toEqual(object.position.x);
        });
        it("camera z positions should be equal to object z position", () => {
            expect(camera.position.z).toEqual(object.position.z);
        });
        it("camera y positions should be higher than object y position", () => {
            expect(camera.position.y).toBeGreaterThan(object.position.y);
        });
    });

    describe("Testing zoomIn", () => {
        it("camera (orthographic) right and top frustum planes should decrease, left and bottom frustum planes should increase", () => {
            const tmpCamera: TopViewCamera = camera.clone();
            camera.zoomIn();
            expect(camera.left).toBeGreaterThan(tmpCamera.left);
            expect(camera.right).toBeLessThan(tmpCamera.right);
            expect(camera.top).toBeLessThan(tmpCamera.top);
            expect(camera.bottom).toBeGreaterThan(tmpCamera.bottom);
        });
    });

    describe("Testing zoomOut", () => {
        it("camera (orthographic) right and top frustum planes should increase, left and bottom frustum planes should decrease", () => {
            const tmpCamera: TopViewCamera = camera.clone();
            camera.zoomOut();
            expect(camera.left).toBeLessThan(tmpCamera.left);
            expect(camera.right).toBeGreaterThan(tmpCamera.right);
            expect(camera.top).toBeGreaterThan(tmpCamera.top);
            expect(camera.bottom).toBeLessThan(tmpCamera.bottom);
        });
    });
});
