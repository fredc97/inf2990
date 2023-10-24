import { Injectable } from "@angular/core";
import { Player } from "./player";
import { Subject } from "rxjs/Subject";

// When estimating round time, the value is equalt to estimator * +/- 50%
const MAX_ESTIMATION_FACTOR: number = 1.5;
const MIN_ESTIMATION_FACTOR: number = 0.5;
const NUMBER_RACE: number = 3;

@Injectable()
export class ProgressRace {
    private players: Player[];
    public readonly progressObserver: Subject<boolean>;
    public constructor(players: Player[]) {
        this.players = players;
        this.progressObserver = new Subject<boolean>();
        this.progressObserver.next(true);
    }

    public hasEnded(): boolean {
        for (const player of this.players) {
            if (player.getNumberLap() === NUMBER_RACE) {
                player.setNumberLap(0);
                if (player === this.players[0]) {
                    this.finishRace();
                    this.progressObserver.next(false);

                    return true;
                }

            }
        }

        return false;
    }
    private finishRace(): void {
        for (const player of this.players) {
            if (player.getRoundsTime().length < NUMBER_RACE) {
                this.estimateTime(player.getRoundsTime());
            }
        }
    }

    private estimateTime(roundsTime: Date[]): void {
        switch (roundsTime.length) {
            case 0: {
                for (let i: number = 0; i < NUMBER_RACE; i++) {
                    const playerTime: number = this.players[0].getRoundsTime()[0].getTime();
                    roundsTime.push(new Date(playerTime * this.randomFactor()));
                }
                break;
            }
            case 1: {
                for (let i: number = 0; i < 2; i++) {
                    const time: Date = new Date(roundsTime[0].getTime() * this.randomFactor());
                    roundsTime.push(time);
                }
                break;
            }
            default: {
                const mean: number = roundsTime[0].getTime() + roundsTime[1].getTime() / 2;
                roundsTime.push(new Date(mean));
                break;
            }
        }
    }

    private randomFactor(): number {
        return Math.random() * (MAX_ESTIMATION_FACTOR - MIN_ESTIMATION_FACTOR) + MIN_ESTIMATION_FACTOR;
    }
}
