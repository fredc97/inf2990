import { Vector3, BoxGeometry, Mesh, Scene, Line } from "three";
import { CheckpointGenerator } from "./checkpointGenerator";
import { CarGenerator } from "./carGenerator";
import { TrackGenerator } from "./trackGenerator";
import { Player } from "../../racing-game/player";
import { SkyboxGenerator } from "./skyboxGenerator";
import { WallGenerator } from "./wallGenerator";
export const TRACK_SCALE: number = 10;

export class TrackElementsGenerator {

    private trackGenerator: TrackGenerator;
    private geometries: BoxGeometry[];
    private carGenerator: CarGenerator;
    private checkpointGenerator: CheckpointGenerator;
    private checkPoints: Mesh[];
    private skyboxGenerator: SkyboxGenerator;
    private wallGenerator: WallGenerator;

    public constructor() {
        this.geometries = [];
        this.trackGenerator = new TrackGenerator(this.geometries);
        this.carGenerator = new CarGenerator(this.geometries);
        this.checkpointGenerator = new CheckpointGenerator();
        this.skyboxGenerator = new SkyboxGenerator();
        this.checkPoints = new Array<Mesh>();
        this.wallGenerator = new WallGenerator(this.geometries);
    }

    public generate(scene: Scene, points: Vector3[], players: Player[], trackScale: number ): Mesh[] {
        this.generateViewTrack(scene, points, trackScale);
        this.skyboxGenerator.generateSkyBox(scene);
        this.trackGenerator.generatePlane(scene);
        this.checkPoints.push(this.checkpointGenerator.generateCheckPoint(points, this.geometries, 2));
        this.checkPoints[0].geometry.computeBoundingBox();
        this.checkPoints.push(this.checkpointGenerator.generateCheckPoint(points, this.geometries, 0));
        this.checkPoints[1].geometry.computeBoundingBox();
        for (const checkPoint of this.checkPoints) {
           scene.add(checkPoint);
        }
        this.carGenerator.generateCars(players);

        return this.checkPoints;

    }
    public generateViewTrack(scene: Scene, points: Vector3[], trackScale: number): void {
        for (const point of this.trackGenerator.generateTrack(points, trackScale)) {
            scene.add(point);
        }
    }
    public generateTrack(points: Vector3[]): BoxGeometry[] {
        this.trackGenerator.generateTrack(points, TRACK_SCALE);

        return this.geometries = this.trackGenerator.getGeometries();
    }
    public generateWall(): Line[] {
       return this.wallGenerator.generateWall();
    }
    public getGeometries(): BoxGeometry[] {
        return this.geometries;
    }

}
