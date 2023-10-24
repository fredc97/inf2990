import { OrthographicCamera, Object3D } from "three";
import { GameCamera } from "./game-camera";

const ORTHOGRAPHIC_CAMERA_FACTOR: number = 50;
const INITIAL_ORTHOGRAPHIC_CAMERA_POSITION_Y: number = 25;
const MAX_ORTHOGRAPHIC_ZOOM: number = 4;
const MIN_ORTHOGRAPHIC_ZOOM: number = 35;
const ORTHOGRAPHIC_ZOOM_FACTOR: number = 1.05;

export class TopViewCamera extends OrthographicCamera implements GameCamera {
    private target: Object3D;
    public constructor(target: Object3D, width: number, height: number) {
        super(
            -width / ORTHOGRAPHIC_CAMERA_FACTOR,
            width / ORTHOGRAPHIC_CAMERA_FACTOR,
            height / ORTHOGRAPHIC_CAMERA_FACTOR,
            -height / ORTHOGRAPHIC_CAMERA_FACTOR,
        );
        this.target = target;
    }

    public init(): void {

        this.position.set(0, INITIAL_ORTHOGRAPHIC_CAMERA_POSITION_Y, 0);
        this.lookAt(this.target.position);
    }

    public update(): void {
        this.position.set(this.target.position.x,
                          this.position.y,
                          this.target.position.z);
    }

    public onResize(width: number, height: number): void {
        this.left = -width / ORTHOGRAPHIC_CAMERA_FACTOR;
        this.right = width / ORTHOGRAPHIC_CAMERA_FACTOR;
        this.bottom = -height / ORTHOGRAPHIC_CAMERA_FACTOR;
        this.top = height / ORTHOGRAPHIC_CAMERA_FACTOR;
        this.updateProjectionMatrix();
    }

    public zoomIn(): void {
        if (this.right >= MAX_ORTHOGRAPHIC_ZOOM) {
            this.left /= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.right /= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.top /= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.bottom /= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.updateProjectionMatrix();
        }
        this.update();
    }

    public zoomOut(): void {
        if (this.right <= MIN_ORTHOGRAPHIC_ZOOM) {
            this.left *= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.right *= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.top *= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.bottom *= ORTHOGRAPHIC_ZOOM_FACTOR;
            this.updateProjectionMatrix();
        }
        this.update();
    }

}
