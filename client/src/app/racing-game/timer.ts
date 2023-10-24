import { Injectable } from "@angular/core";
const TIME: number = 1000;
const ONE_MINUTE: number = 60;
@Injectable()
export class Timer {

    private timer: number;
    private seconds: number;
    private minutes: number;

    public constructor() {
        this.seconds = 0;
        this.minutes = 0;
    }

    public setTime(seconds: number, minutes: number): void {
        this.seconds = seconds;
        this.minutes = minutes;
    }

    public getTime(): Object {
        return { seconds: this.seconds, minutes: this.minutes };
    }

    public startTimer(): void {
        this.timer = window.setInterval(() => {
            this.seconds++;
            if (this.seconds % ONE_MINUTE === 0) {
                this.minutes++;
                this.seconds = 0;
            }
         },                             TIME);
    }

    public resetTimer(): void {
        this.seconds = 0;
        this.minutes = 0;
    }

    public stopTimer(): void {
        clearInterval(this.timer);
    }

    public getMinutes(): number {
        return this.minutes;
    }

    public getSecondes(): number {
        return this.seconds;
    }

}
