import { SoundMaster } from "../sound-master";
import { Sound } from "../../constants/sound-constants";
import { Car } from "../car/car";
import { Vector3 } from "three";
import { Player } from "../player";

const COUNTDOWN: number = 3;
const TIME: number = 1000;
export class CountDown {
    private sound: SoundMaster;
    private countDown: number;
    public constructor() {
        this.sound = new SoundMaster();
        this.countDown = COUNTDOWN;
    }
    public startTimer(car: Car): void {
        const countdown: number = window.setInterval(() => {
            if (this.countDown > 1) {
                this.sound.startSound(car, Sound.PATH_WAIT_START_SOUND);
                this.countDown--;
            } else if (this.countDown === 1) {
                this.sound.startSound(car, Sound.PATH_START_SOUND);
                this.countDown--;
            } else {
                clearInterval(countdown);
            }
        },                                           TIME);

    }
    public getCountDown(): number {
        return this.countDown;
    }

    // Make sure that the car won't move until the count down is finished
    public checkGameStart(players: Player[]): void {
        if (this.countDown > 0) {
            players.forEach((player) => {
                player.getCar().speed = new Vector3(0, 0, 0);
                player.setLastDate(Date.now());
            });
        }
    }

}
