import {PerspectiveCamera,  Scene, AmbientLight, WebGLRenderer} from "three";
import Stats = require("stats.js");
import { Track } from "./track";

const FAR_CLIPPING_PLANE: number = 1000;
const NEAR_CLIPPING_PLANE: number = 1;
const FIELD_OF_VIEW: number = 70;
const INITIAL_CAMERA_POSITION_Y: number = 25;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
const STYLE_POSITION: string = "absolute";

export class SceneCreation {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private stats: Stats;
    private renderer: WebGLRenderer;

    public constructor() { }

    public getCamera(): PerspectiveCamera {
        return this.camera;
    }

    public getAspectRatio(container: HTMLDivElement): number {
        return container.clientWidth / container.clientHeight;
    }

    public async createScene(container: HTMLDivElement, track: Track): Promise<void> {
        this.scene = new Scene();

        this.camera = new PerspectiveCamera(
            FIELD_OF_VIEW,
            this.getAspectRatio(container),
            NEAR_CLIPPING_PLANE,
            FAR_CLIPPING_PLANE
        );

        this.camera.position.set(0, INITIAL_CAMERA_POSITION_Y, 0);
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));
        this.getScene().add(track.addPlan());
        this.getCamera().lookAt(track.addPlan().position);
        this.initStats(container);
        this.startRenderingLoop(container);
    }

    public initStats(container: HTMLDivElement): void {
        this.stats = new Stats();
        this.stats.dom.style.position = STYLE_POSITION;
        container.appendChild(this.stats.dom);
    }

    public render(renderer: WebGLRenderer): void {
        requestAnimationFrame(() => this.render(renderer));
        renderer.render(this.scene, this.getCamera());
        this.stats.update();
    }

    public startRenderingLoop(container: HTMLDivElement): void {
        this.renderer = new WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);
        this.render(this.renderer);
    }

    public onResize(container: HTMLDivElement): void {
        this.camera.aspect = this.getAspectRatio(container);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public getRenderer(): WebGLRenderer {
        return this.renderer;
    }
    public getScene(): Scene {
        return this.scene;
    }
}
