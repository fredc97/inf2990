import { Injectable } from "@angular/core";
import { Car } from "./car/car";
import { Audio } from "three";
import { SoundMaster } from "./sound-master";
import { Sound } from "../constants/sound-constants";

@Injectable()
export class Player {

    protected car: Car;
    protected roundsTimes: Date[];
    protected lastDate: number;
    protected arrivedAtCheckPoint: boolean;
    protected lapNumber: number;
    protected audioAcceleration: Audio;
    protected sound: SoundMaster;

    public constructor(car: Car) {
        this.roundsTimes = [];
        this.lastDate = Date.now();
        this.arrivedAtCheckPoint = false;
        this.lapNumber = 0;
        this.car = car;
        this.sound = new SoundMaster();
        this.audioAcceleration = this.sound.startAccelerationSound(this.car, Sound.PATH_SOUND_CAR);
    }

    public isArriverdAtCkecPoint(): boolean {
        return this.arrivedAtCheckPoint;
    }
    public setIsSpentCheckPoint(spent: boolean): void {
        this.arrivedAtCheckPoint = spent;
    }

    public update(timeSinceLastFrame: number): void {
        this.updateVolume();
        this.car.update(timeSinceLastFrame);
    }

    public updateLap(): void {
        if (this.arrivedAtCheckPoint) {
            this.lapNumber++;
            this.roundsTimes.push(new Date(Date.now() - this.lastDate));
            this.lastDate = Date.now();
            this.arrivedAtCheckPoint = false;
        }
        this.sound.setVolume(this.car, this.audioAcceleration);
    }
    public getCar(): Car {
        return this.car;
    }

    public getNumberLap(): number {
        return this.lapNumber;
    }

    public setNumberLap(lap: number): void {
        this.lapNumber = lap;
    }

    public getRoundsTime(): Date[] {
        return this.roundsTimes;
    }

    public setRoundsTime(time: Date[]): void {
        this.roundsTimes = time;
    }

    public setLastDate(lastDate: number): void {
        this.lastDate = lastDate;
    }
    public updateVolume(): void {
        this.sound.setVolume(this.car, this.audioAcceleration);
    }
}
