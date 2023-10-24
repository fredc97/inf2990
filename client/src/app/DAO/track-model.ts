import { Vector3 } from "three";

export interface TrackModel {
    id: string;
    name: string;
    description: string;
    points: Vector3[];
    timesPlayed: number;
}
