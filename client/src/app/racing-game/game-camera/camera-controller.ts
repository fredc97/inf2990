import { Injectable } from "@angular/core";
import { Camera, Object3D, Vector3 } from "three";
import { TopViewCamera } from "./top-view-camera";
import { ThirdPersonCamera } from "./third-person-camera";
import { EventHandlerService } from "../event-handler.service";

const CAMERA_KEYCODE: number = 67;      // c
const ZOOM_IN: number = 107;               // numPad +
const ZOOM_OUT: number = 109;           // numPad -

@Injectable()
export class CameraController {

    private actualCamera: Camera;
    private thirdPersonCamera: ThirdPersonCamera;
    private topViewCamera: TopViewCamera;

    public constructor(private eventHandler: EventHandlerService, target: Object3D, width: number, height: number) {
        this.topViewCamera = new TopViewCamera(target, width, height);
        this.thirdPersonCamera = new ThirdPersonCamera(target, width, height);
    }

    public getActualCamera(): Camera {
        return this.actualCamera;
    }
    public getCameraPosition(): Vector3 {
        return this.actualCamera.position;
    }

    public refreshSize(width: number, height: number): void {
        this.thirdPersonCamera.onResize(width, height);
        this.topViewCamera.onResize(width, height);
    }

    public init(): void {
        this.thirdPersonCamera.init();
        this.topViewCamera.init();
        this.actualCamera = this.thirdPersonCamera;
        this.initControl();
    }

    public update(): void {
        this.topViewCamera.update();
    }

    public switchCamera(): void {
        this.actualCamera = (this.actualCamera === this.thirdPersonCamera) ? this.topViewCamera : this.thirdPersonCamera;
    }

    public zoomIn(): void {
        this.thirdPersonCamera.zoomIn();
        this.topViewCamera.zoomIn();
    }

    public zoomOut(): void {
        this.thirdPersonCamera.zoomOut();
        this.topViewCamera.zoomOut();
    }

    private initControl(): void {
        this.eventHandler.keyDownRegister.set(CAMERA_KEYCODE, () => this.switchCamera());
        this.eventHandler.keyDownRegister.set(ZOOM_IN, () => this.zoomIn());
        this.eventHandler.keyDownRegister.set(ZOOM_OUT, () => this.zoomOut());
    }

}
