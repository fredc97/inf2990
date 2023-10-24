import { TestBed, inject } from "@angular/core/testing";

import { CollisionResolverService } from "./collision-resolver.service";
import { Car } from "../car/car";
import { Vector3, Object3D, Scene } from "three";

// tslint:disable:no-magic-numbers
describe("CollisionResolverService", () => {
  const carA: Car = new Car();
  const meshA: Object3D = new Object3D();
  const carB: Car = new Car();
  const meshB: Object3D = new Object3D();
  const scene: Scene = new Scene();
  carA.setMesh(meshA);
  carB.setMesh(meshB);
  carA.add(meshA);
  carB.add(meshB);
  scene.add(carA);
  scene.add(carB);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CollisionResolverService]
    });
  });
  it("should be created", inject([CollisionResolverService], (service: CollisionResolverService) => {
    expect(service).toBeTruthy();
  }));

  describe("Elastic collision: carA.speed = -carB.speed", () => {
    carA.speed = new Vector3(5, 0, 5);
    carB.speed = new Vector3(-5, 0, -5);

    it("speed of each car should be equal to 0",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carA.speed).toEqual(new Vector3());
        expect(carB.speed).toEqual(new Vector3());
      }));
  });

  describe("Frontal vs Frontal", () => {
    carA.speed = new Vector3(0, 0, 10);
    carB.speed = new Vector3(0, 0, -5);

    it("carA final speed.z should be lower than initial speed.z (the initial speed.z was positive)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carA.speed.z).toBeLessThan(10);
      }));
    it("carB final speed.z should be greater than initial speed.z (the initial speed.z was negative)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carB.speed.z).toBeGreaterThan(-5);
      }));
  });

  describe("Frontal vs Side", () => {
    carA.speed = new Vector3(0, 0, 10);
    carB.speed = new Vector3(-5, 0, 0);

    it("carA final speed.z should be lower than initial speed.z (the initial speed.z was positive)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carA.speed.z).toBeLessThan(10);
      }));
    it("carB final speed.x should be greater than initial speed.x (the initial speed.x was negative)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carB.speed.x).toBeGreaterThan(-5);
      }));
  });

  describe("Side vs Side", () => {
    carA.speed = new Vector3(10, 0, 0);
    carB.speed = new Vector3(-5, 0, 0);

    it("carA final speed.x should be lower than initial speed.x (the initial speed.x was positive)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carA.speed.x).toBeLessThan(10);
      }));
    it("carB final speed.x should be greater than initial speed.x (the initial speed.x was negative)",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carB.speed.x).toBeGreaterThan(-5);
      }));
  });

  describe("Collision Force", () => {
    carA.speed = new Vector3(10, 0, 0);
    carB.speed = new Vector3(-5, 0, 0);

    it("carA collision force should be not equal to 0",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carA.getCollisionForce()).not.toEqual(new Vector3());
      }));
    it("carB collision force should be not equal to 0",
       inject([CollisionResolverService], (service: CollisionResolverService) => {
        service.resolveCollision(carA, carB);
        expect(carB.getCollisionForce()).not.toEqual(new Vector3());
      }));
  });
});
