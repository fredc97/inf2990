import { Injectable } from "@angular/core";
import { RenderService } from "./render-service/render.service";
import { EventHandlerService } from "./event-handler.service";
import { CollisionDetectionService } from "./collision/collision-detection.service";
import { CarController } from "./car/car-controller";
import { Player } from "./player";
import { Mesh, Vector3 } from "three";
import { TrackElementsGenerator, TRACK_SCALE } from "../track-component/track/trackElementsGenerator";
import { CountDown } from "./render-service/countDown";
import { ProgressRace } from "./progress-race";
import { Subject } from "rxjs/Subject";
import { VirtualPlayer } from "./virtual-player";

@Injectable()
export class GameControllerService {
    private players: Player[];
    private points: Array<Vector3>;
    private timerCountDown: CountDown;
    private race: ProgressRace;
    private lastAnimationId: number;

    public constructor(
        private collisionDetectionService: CollisionDetectionService,
        private eventHandler: EventHandlerService,
        private renderService: RenderService) {
        this.points = [];
        this.timerCountDown = new CountDown();
        this.lastAnimationId = 0;
    }

    public init(): void {
        this.players = this.renderService.getPlayers();
        this.race = new ProgressRace(this.players);
        const carController: CarController = new CarController(this.eventHandler, this.players[0].getCar());
        carController.init();
        this.createVirtualPlyers();
        this.prepareTrack();
        this.timerCountDown.startTimer(this.players[0].getCar());
        this.renderService.startRenderingLoop();
        this.update();
    }

    public update(): void {
        this.lastAnimationId = requestAnimationFrame(() => this.update());

        if (this.race.hasEnded()) {
            this.stopUpdating();
        }
        this.collisionDetectionService.update();
        this.timerCountDown.checkGameStart(this.players);
    }

    private stopUpdating(): void {
        cancelAnimationFrame(this.lastAnimationId);
        this.renderService.stopRenderingLoop();
    }

    private createVirtualPlyers(): void {
        for (let i: number = 1; i < this.players.length; i++) {
            this.players[i] = new VirtualPlayer(this.players[i].getCar(), this.points);
        }
    }

    private prepareTrack(): void {
        const generator: TrackElementsGenerator = new TrackElementsGenerator();
        const checkPoints: Mesh[] = generator.generate(this.renderService.getScene(), this.points, this.players, TRACK_SCALE);
        generator.generateTrack(this.points);
        this.collisionDetectionService.init(this.players, checkPoints, generator.generateWall());
    }

    public setPoints(points: Vector3[]): void {
        this.points = points;
    }

    public getProgressValue(): Subject<boolean> {
        return this.race.progressObserver;
    }
}
