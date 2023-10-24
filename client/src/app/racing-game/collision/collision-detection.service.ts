import { Injectable } from "@angular/core";
import { CollisionResolverService } from "./collision-resolver.service";
import { SoundMaster } from "../sound-master";
import { Sound } from "../../constants/sound-constants";
import { Mesh, Line, Vector3 } from "three";
import { Player } from "../player";
import { CHECKPOINT_NAME, ARRIVAL_POINT_NAME } from "../../track-component/track/checkpointGenerator";

const COLLISION_RATE: number = 50;

@Injectable()
export class CollisionDetectionService {
    private players: Player[];
    private checkPoints: Mesh[];
    private lastDate: number;
    private collisionSound: SoundMaster;
    private walls: Line[];
    public constructor(private collisionResolver: CollisionResolverService) {
        this.players = [];
        this.checkPoints = [];
        this.lastDate = Date.now();
        this.walls = [];
        this.collisionSound = new SoundMaster();
    }

    public init(players: Player[], checkPoints: Mesh[], walls: Line[]): void {
        this.players = players;
        this.checkPoints = checkPoints;
        this.walls = walls;
    }
    public update(): void {
        if (Date.now() - this.lastDate > COLLISION_RATE) {
            this.checkCollisionCar();
            this.checkCollisionCheckPoint();
            this.checkCollisionWall();
            this.lastDate = Date.now();
        }
    }

    private checkCollisionCar(): void {
        for (let i: number = 0; i < this.players.length; i++) {
            for (let j: number = i + 1; j < this.players.length; j++) {
                if (this.players[i].getCar().getBoundingBox().checkCollision(this.players[j].getCar().getBoundingBox())) {
                    this.collisionSound.startSound(this.players[i].getCar(), Sound.PATH_SOUND_CAR_COLLISION);
                    this.collisionResolver.resolveCollision(this.players[i].getCar(), this.players[j].getCar());
                }
            }
        }
    }

    private checkCollisionCheckPoint(): void {
        for (const checkPoint of this.checkPoints) {
            for (const player of this.players) {
                if (player.getCar().getBoundingBox().collisionCheckPoint(checkPoint.geometry.boundingBox)) {
                    if (checkPoint.name === CHECKPOINT_NAME) {
                        player.setIsSpentCheckPoint(true);
                    } else if (checkPoint.name === ARRIVAL_POINT_NAME) {
                        player.updateLap();
                    }
                }
            }
        }
    }

    private checkCollisionWall(): void {
        for (const wall of this.walls) {
            for (const player of this.players) {
                if (player.getCar().getBoundingBox().collisionWall(wall.geometry.boundingBox)) {
                    player.getCar().speed = new Vector3(0, 0, 2);
                    if (this.players.indexOf(player) === 0) {
                        this.collisionSound.startSound(player.getCar(), Sound.PATH_SOUND_WALL_COLLISION);
                    }
                }
            }
        }
    }
}
