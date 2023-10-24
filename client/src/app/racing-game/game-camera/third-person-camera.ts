import { GameCamera } from "./game-camera";
import { PerspectiveCamera, Object3D } from "three";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_PERSPECTIVE_CAMERA_POSITION_Y: number = 3;
const INITIAL_PERSPECTIVE_CAMERA_POSITION_Z: number = 6;
const MAX_PERSPECTIVE_ZOOM: number = 1.4;
const MIN_PERSPECTIVE_ZOOM: number = 7.4;
const PERSPECTIVE_ZOOM_FACTOR_Y: number = 0.1;
const PERSPECTIVE_ZOOM_FACTOR_Z: number = 0.2;

export class ThirdPersonCamera extends PerspectiveCamera implements GameCamera {
    private target: Object3D;
    public constructor(target: Object3D, width: number, height: number) {
        super(FIELD_OF_VIEW, width / height, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE);
        this.target = target;
    }

    public init(): void {
        this.target.add(this);
        this.position.set(0, INITIAL_PERSPECTIVE_CAMERA_POSITION_Y, INITIAL_PERSPECTIVE_CAMERA_POSITION_Z);
        this.lookAt(this.target.position);
    }

    public onResize(width: number, height: number): void {
        this.aspect = width / height;
        this.updateProjectionMatrix();
    }

    public zoomIn(): void {
        if (this.position.y >= MAX_PERSPECTIVE_ZOOM) {
            this.position.z -= PERSPECTIVE_ZOOM_FACTOR_Z;
            this.position.y -= PERSPECTIVE_ZOOM_FACTOR_Y;
        }
    }

    public zoomOut(): void {
        if (this.position.y <= MIN_PERSPECTIVE_ZOOM) {
            this.position.z += PERSPECTIVE_ZOOM_FACTOR_Z;
            this.position.y += PERSPECTIVE_ZOOM_FACTOR_Y;
        }
    }

}
