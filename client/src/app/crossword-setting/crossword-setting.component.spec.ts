import { CrosswordSettingComponent } from "./crossword-setting.component";
import { RoomInterface } from "../../../../common/interfaces/room-interface";
import { GridInterface } from "../../../../common/interfaces/grid-interface";

describe("CrosswordSettingComponent", () => {

    const crosswordSettingComponent: CrosswordSettingComponent = new CrosswordSettingComponent();

    describe("Select a difficulty", () => {
        it("should set correctly the selected difficulty - Easy", () => {
            crosswordSettingComponent.onSelectedDifficulty("Easy");
            expect(crosswordSettingComponent.selectedDifficulty).toEqual("Easy");
        });
        it("should set correctly the selected difficulty - Normal", () => {
            crosswordSettingComponent.onSelectedDifficulty("Normal");
            expect(crosswordSettingComponent.selectedDifficulty).toEqual("Normal");
        });
        it("should set correctly the selected difficulty - Hard", () => {
            crosswordSettingComponent.onSelectedDifficulty("Hard");
            expect(crosswordSettingComponent.selectedDifficulty).toEqual("Hard");
        });
    });

    describe("Select a number of players", () => {
        it("should set correctly the selected number of players - One Player", () => {
            crosswordSettingComponent.onSelectedNumber("One Player");
            expect(crosswordSettingComponent.selectedNumber).toEqual("One Player");
        });
        it("should set correctly the selected difficulty - Two Players", () => {
            crosswordSettingComponent.onSelectedNumber("Two Players");
            expect(crosswordSettingComponent.selectedNumber).toEqual("Two Players");
        });
    });
    describe("Joining a room", () => {
        const room: RoomInterface = {
            players: ["Son-Thang Pham"],
            name: "LOLG2990",
            difficulty: "HARD",
            grid: undefined,
            rematchs: [false , false]
        };
        it("should be able to join a room if theres is one player in the room", () => {
            let ableToJoin: boolean = room.players.length < 2;
            expect(ableToJoin).toEqual(true);
            room.players.push("Frederic Carpentier");
            ableToJoin = room.players.length < 2;
            expect(ableToJoin).toEqual(false);
        });
        it("should set correctly the selected difficulty - Two Players", () => {
            crosswordSettingComponent.onSelectedNumber("Two Players");
            expect(crosswordSettingComponent.selectedNumber).toEqual("Two Players");
        });
    });
    describe("List of the rooms", () => {
        it("should show the list of the rooms the difficulty and the mode of each if all the conditions are true", () => {
            const popUpWaiting: boolean = crosswordSettingComponent.message._popUp._isWaitingPlayer = false;
            const numberOfPlayers: string = crosswordSettingComponent.selectedNumber = "Two Players";
            const difficulty: string = crosswordSettingComponent.selectedDifficulty = "Easy";
            const aRoom: RoomInterface = crosswordSettingComponent.selectedRoom = undefined;
            const popUpCreating: boolean = crosswordSettingComponent.message._popUp._isCreatingGrid = false;

            const isShowingList: boolean = (!popUpWaiting && (numberOfPlayers === "Two Players") && difficulty
                                           && aRoom === undefined && !popUpCreating);
            expect(isShowingList).toBe(true);
        });
    });
    describe("Verify availibility of the room to join (two players)", () => {
        const aGrid: GridInterface = {
            _words: [],
            _letters: [],
            _difficulty: 1
        };
        const room: RoomInterface = {
            players: ["Paul", "George"],
            name: "Jeu",
            difficulty: "Easy",
            grid: aGrid,
            rematchs: []
        };
        it("should show the game only if all the conditions are true", () => {
            const numberOfPlayers: string = crosswordSettingComponent.selectedNumber = "Two Players";
            const difficulty: string = crosswordSettingComponent.selectedDifficulty = "Easy";
            const aRoom: RoomInterface = crosswordSettingComponent.selectedRoom = room;
            const isAbleToStart: boolean = (difficulty && aRoom !== undefined && numberOfPlayers === "Two Players"
                                           && aRoom.players.length === 2 && room.grid !== undefined);
            expect(isAbleToStart).toBe(true);
        });
        it("should wait if not all players are in the room", () => {
            room.players.pop();
            expect(crosswordSettingComponent.message._popUp._isWaitingPlayer).toBe(false);
            crosswordSettingComponent.verifyAvailability(room);
            expect(crosswordSettingComponent.message._popUp._isWaitingPlayer).toBe(true);
        });
        it("should start the game if all the players are in the game", () => {
            room.players.push("Fred");
            expect(crosswordSettingComponent.message._popUp._isWaitingPlayer).toBe(true);
            crosswordSettingComponent.verifyAvailability(room);
            expect(crosswordSettingComponent.message._popUp._isWaitingPlayer).toBe(false);
        });
    });
});
