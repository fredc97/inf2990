import { Player } from "./player";
import { Car } from "./car/car";

describe("Player", () => {
    let player: Player;

    it("should be instantiable using default constructor", () => {
        player = new Player(new Car());
        expect(player).toBeDefined();
        expect(player.getNumberLap()).toBe(0);
    });

    it("should be update lap number", () => {
        player = new Player(new Car());
        player.setNumberLap(2);
        expect(player.getNumberLap()).toBe(2);
    });
});
