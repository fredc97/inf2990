import { Injectable } from "@angular/core";
import { AudioLoader, Audio, AudioListener, AudioBuffer } from "three";
import { Car } from "./car/car";
import { Sound } from "../constants/sound-constants";
const MAX_SPEED: number = 220;
const TO_KM_HEURE: number = 3.6;
@Injectable()
export class SoundMaster {

    private isOn: boolean;
    public constructor() {
        this.isOn = true;
    }

    public startSound(car: Car, path: Sound): Audio {
        const soundEffect: Audio = this.loadSound(path, false);
        car.add(soundEffect);

        return soundEffect;
    }

    public startAccelerationSound(car: Car, path: Sound): Audio {
        const soundEffect: Audio = this.loadSound(path, true);
        car.add(soundEffect);
        this.isOn = false;
        this.setVolume(car, soundEffect);

        return soundEffect;

    }

    private loadSound(path: Sound, isLoop: boolean): Audio {
        const listener: AudioListener = new AudioListener();
        const soundEffect: Audio = new Audio(listener);
        const loader: AudioLoader = new AudioLoader();
        loader.load(
            path,
            (audioBuffer: AudioBuffer) => {
                soundEffect.setBuffer(audioBuffer);
                soundEffect.play();
                soundEffect.setLoop( isLoop );
            },
            (xhr: XMLHttpRequest) => { },
            (err: Event) => { }
        );

        return soundEffect;
    }

    public setIsOn(isOn: boolean): void {
        this.isOn = isOn;
    }

    public getIsOn(): boolean {
        return this.isOn;
    }

    public stopSound(sound: Audio): void {
        sound.pause();
    }

    public setVolume(car: Car, soundEffect: Audio): void {
        soundEffect.setVolume(this.calculateSpeed(car));
    }

    private calculateSpeed(car: Car): number {
        const relativeSpeed: number = car.speed.length() * TO_KM_HEURE;

        return Math.min((relativeSpeed / MAX_SPEED), 1);
    }

}
