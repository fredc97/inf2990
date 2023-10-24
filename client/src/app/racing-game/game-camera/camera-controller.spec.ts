import { CameraController } from "./camera-controller";
import { Camera, Object3D } from "three";
import { EventHandlerService } from "../event-handler.service";

describe("Game Camera", () => {
    // tslint:disable-next-line:no-magic-numbers (simulating a standard resolution)
    const camera: CameraController = new CameraController(new EventHandlerService(), new Object3D(), 800, 600);
    camera.init();

    describe("Camera switching", () => {
        const previousCamera: Camera = camera.getActualCamera();
        camera.switchCamera();
        it("camera should switch to the second one", () => {
            expect(camera.getActualCamera()).not.toEqual(previousCamera);
        });
    });
});
