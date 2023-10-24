import { Player } from "./player";
import { Car } from "./car/car";
import { Vector3 } from "three";
import { TRACK_SCALE } from "../track-component/track/trackElementsGenerator";

const MAX_DISTANCE: number = 5;
const MIN_DISTANCE: number = 1;
const MAX_DEVIATION: number = 0.1;
const MIN_DEVIATION: number = 0.01;

export class VirtualPlayer extends Player {

    private trackPoints: Vector3[];
    private arrivalPoint: Vector3;
    private previousPoint: Vector3;

    public constructor(car: Car, trackPoints: Vector3[]) {
        super(car);
        this.trackPoints = [];
        this.lastDate = Date.now();
        for (const point of trackPoints) {
            const scaledPoint: Vector3 = new Vector3(point.x * TRACK_SCALE, 0, point.z * TRACK_SCALE);
            this.trackPoints.push(scaledPoint);
        }
        this.trackPoints.reverse();
        this.arrivalPoint = this.trackPoints[0];
        this.previousPoint = this.trackPoints[this.trackPoints.length - 1];
    }

    public update(timeSinceLastFrame: number): void {
        super.update(timeSinceLastFrame);
        if (!this.isRotating()) {
            this.accelerate();
        }
    }

    private accelerate(): void {
        const carToArrivalPointDistanceX: number = Math.abs(this.arrivalPoint.x - this.car.getMesh().position.x);
        const carToArrivalPointDistanceZ: number = Math.abs(this.arrivalPoint.z - this.car.getMesh().position.z);
        const maxDistanceX: boolean = carToArrivalPointDistanceX > MAX_DISTANCE;
        const minDistanceX: boolean = carToArrivalPointDistanceX > MIN_DISTANCE;
        const maxDistanceZ: boolean = carToArrivalPointDistanceZ > MAX_DISTANCE;
        const minDistanceZ: boolean =  carToArrivalPointDistanceZ > MIN_DISTANCE;

        if ( (maxDistanceX && minDistanceZ) || (minDistanceX && maxDistanceZ) ) {
            this.car.isAcceleratorPressed = true;
        } else {
            const nextPointIndex: number = (this.trackPoints.indexOf(this.arrivalPoint) + 1) % this.trackPoints.length;
            this.previousPoint = this.arrivalPoint.clone();
            this.arrivalPoint = this.trackPoints[nextPointIndex];
        }
    }

    private isRotating(): boolean {
        const direction: Vector3 = new Vector3();
        direction.subVectors(this.previousPoint.clone(), this.arrivalPoint.clone()).normalize();
        const carToArrivalPointDirectionX: number = Math.abs(direction.x - this.car.getMesh().getWorldDirection().x);
        const carToArrivalPointDirectionZ: number = Math.abs(direction.z - this.car.getMesh().getWorldDirection().z);
        const maxDeviationX: boolean = carToArrivalPointDirectionX < MAX_DEVIATION;
        const minDeviationX: boolean = carToArrivalPointDirectionX < MIN_DEVIATION;
        const maxDeviationZ: boolean = carToArrivalPointDirectionZ < MAX_DEVIATION;
        const minDeviationZ: boolean = carToArrivalPointDirectionZ < MIN_DEVIATION;

        if ((maxDeviationX && minDeviationZ) || (minDeviationX && maxDeviationZ)) {
            this.car.releaseSteering();

            return false;

        } else {
            this.car.steerLeft();

            return true;
        }
    }
}
