import { Player } from "./player";
import { Car } from "./car/car";
import { ProgressRace } from "./progress-race";

/* tslint:disable: no-magic-numbers */

describe("ProgressRace", () => {

    it("should be false if the player start via async()", () => {
        let players: Player[];
        players = [];
        players.push(new Player(new Car()));
        let progressRace: ProgressRace;
        progressRace = new ProgressRace(players);
        expect(progressRace.hasEnded()).toBe(false);
    });

    it("should be true if the player ended via async()", () => {
        let players: Player[];
        players = [];
        players.push(new Player(new Car()));
        const times: Date[] = [new Date()];
        players[0].setRoundsTime(times);
        players[0].setNumberLap(3);
        let progressRace: ProgressRace;
        progressRace = new ProgressRace(players);
        expect(progressRace.hasEnded()).toBe(true);
    });
});
