import { Injectable } from "@angular/core";
import { WebGLRenderer, Scene, AmbientLight } from "three";
import { Car } from "../car/car";
import { Player } from "../player";
import { CameraController } from "../game-camera/camera-controller";
import { EventHandlerService } from "../event-handler.service";

const NUMBER_OF_CARS: number = 4;
const WHITE: number = 0xFFFFFF;
const AMBIENT_LIGHT_OPACITY: number = 0.5;
@Injectable()
export class RenderService {

    private container: HTMLDivElement;
    private renderer: WebGLRenderer;
    private scene: THREE.Scene;
    private lastDate: number;
    private camera: CameraController;
    private lastAnimationId: number;
    private players: Player[];

    public constructor(private eventHandler: EventHandlerService) {
        this.lastAnimationId = 0;
        this.players = [];
        for (let i: number = 0; i < NUMBER_OF_CARS; i++) {
            this.players.push(new Player(new Car()));
        }
    }

    public async initialize(container: HTMLDivElement): Promise<void> {
        this.container = container;
        await this.createScene();
    }

    private update(): void {
        const timeSinceLastFrame: number = Date.now() - this.lastDate;

        for (const player of this.players) {
            player.update(timeSinceLastFrame);
        }
        this.camera.update();
        this.lastDate = Date.now();
    }

    private async createScene(): Promise<void> {
        this.scene = new Scene();
        for (const player of this.players) {
            await player.getCar().init();
            this.scene.add(player.getCar());
        }
        this.camera = new CameraController(this.eventHandler, this.players[0].getCar().getMesh(),
                                           this.container.clientWidth, this.container.clientHeight);
        this.camera.init();
        this.scene.add(new AmbientLight(WHITE, AMBIENT_LIGHT_OPACITY));

    }

    public startRenderingLoop(): void {
        this.renderer = new WebGLRenderer();
        this.renderer.sortObjects = false;
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.lastDate = Date.now();
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    public stopRenderingLoop(): void {
        cancelAnimationFrame(this.lastAnimationId);
    }

    private render(): void {
        this.lastAnimationId = requestAnimationFrame(() => this.render());
        this.update();
        this.renderer.render(this.scene, this.camera.getActualCamera());
    }

    public onResize(): void {
        this.camera.refreshSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public getScene(): Scene {
        return this.scene;
    }

}
