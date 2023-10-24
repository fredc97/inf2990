import { Injectable } from "@angular/core";
import { Car } from "../car/car";
import { Vector3 } from "three";

const MASS: number = 5;

@Injectable()
export class CollisionResolverService {

    public constructor() { }

    public resolveCollision(carA: Car, carB: Car): void {
        const velocityA: Vector3 = this.getOrhtogonalReferenceFrameVelocity(carA);
        const velocityB: Vector3 = this.getOrhtogonalReferenceFrameVelocity(carB);
        const positionA: Vector3 = carA.getMesh().position.clone();
        const positionB: Vector3 = carB.getMesh().position.clone();
        const distance: number = positionA.distanceTo(positionB);

        const normX: number = this.computeNorm(positionA.x, positionB.x, distance);
        const normZ: number = this.computeNorm(positionA.z, positionB.z, distance);
        const relationFactor: number = this.calculateRelationFactor(velocityA, velocityB, normX, normZ);

        const finalVelocityA: Vector3 = new Vector3();
        const finalVelocityB: Vector3 = new Vector3();
        finalVelocityA.x = velocityA.x - relationFactor * MASS * normX;
        finalVelocityA.z = velocityA.z - relationFactor * MASS * normZ;
        finalVelocityB.x = velocityB.x + relationFactor * MASS * normX;
        finalVelocityB.z = velocityB.z + relationFactor * MASS * normZ;

        const directionA: Vector3 = carA.getMesh().getWorldDirection();
        const directionB: Vector3 = carB.getMesh().getWorldDirection();
        carB.setCollisionForce(this.getCarReferenceFrameVelocity(finalVelocityB, directionB).sub(carB.speed.clone()));
        carA.setCollisionForce(this.getCarReferenceFrameVelocity(finalVelocityA, directionA).sub(carA.speed.clone()));
        carB.speed = this.getCarReferenceFrameVelocity(finalVelocityB, carB.getMesh().getWorldDirection());
        carA.speed = this.getCarReferenceFrameVelocity(finalVelocityA, carA.getMesh().getWorldDirection());

    }

    private computeNorm(positionA: number, positionB: number, distance: number): number {
        return ((positionB - positionA) / distance);
    }

    private calculateRelationFactor(velocityA: Vector3, velocityB: Vector3, normX: number, normZ: number): number {
        return (velocityA.x * normX + velocityA.z * normZ - velocityB.x * normX - velocityB.z * normZ) * 2 / (MASS * 2);
    }

    private getOrhtogonalReferenceFrameVelocity(car: Car): Vector3 {
        const relativeVelocity: Vector3 = new Vector3();
        const direction: Vector3 = car.getMesh().getWorldDirection();
        relativeVelocity.x = car.speed.z * direction.x + car.speed.x * direction.z;
        relativeVelocity.z = car.speed.z * direction.z - car.speed.x * direction.x;

        return relativeVelocity;
    }

    private getCarReferenceFrameVelocity(velocity: Vector3, direction: Vector3): Vector3 {
        const carVelocity: Vector3 = new Vector3();
        carVelocity.x = (velocity.x * direction.z - velocity.z * direction.x) / (Math.pow(direction.z, 2) + Math.pow(direction.x, 2));
        carVelocity.z = (velocity.x * Math.pow(direction.x, 2) + velocity.z * direction.x * direction.z)
            / (direction.x * (Math.pow(direction.x, 2) + Math.pow(direction.z, 2)));

        return carVelocity;
    }

}
