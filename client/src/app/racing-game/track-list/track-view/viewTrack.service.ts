import { Injectable } from "@angular/core";
import { Vector3 } from "three";
import { Track } from "../../../racing-creator/track";
import { SceneCreation } from "../../../racing-creator/sceneCreation";
import { TrackElementsGenerator } from "../../../track-component/track/trackElementsGenerator";

@Injectable()
export class ViewTrackService {
    private container: HTMLDivElement;
    private _track: Track;
    public vect: Vector3[];
    private sceneCreation: SceneCreation;
    private trackGenerator: TrackElementsGenerator;
    private points: Vector3[];

    public constructor() {
        this._track = new Track();
        this.vect = [];
        this.sceneCreation = new SceneCreation();
        this.trackGenerator = new TrackElementsGenerator();
        this.points = [];
    }
    public setTrack(point: Vector3[]): void {
        this.points = point;
    }
    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }

        await this.sceneCreation.createScene(this.container, this._track);
        this.initializeScene();
    }
    public initializeScene(): void {
        this.trackGenerator.generateViewTrack(this.sceneCreation.getScene(), this.points, 1);
        this.sceneCreation.getCamera().lookAt(this._track.addPlan().position);
        this.sceneCreation.initStats(this.container);
        this.sceneCreation.startRenderingLoop(this.container);
    }
    public getTrackPoint(): Vector3[] {
        return this.points;
    }
}
