import { MockSocketService } from "./mock-socket-service";
import * as chai from "chai";
import { RoomInterface } from "../../../common/interfaces/room-interface";
import { GridInterface } from "../../../common/interfaces/grid-interface";
import { LetterInterface } from "../../../common/interfaces/letter-interface";
import { WordInterface } from "../../../common/interfaces/word-interface";
// tslint:disable:no-magic-numbers

describe("SocketService", () => {
    const socketService: MockSocketService = new MockSocketService();
    it("should initialize correctly the parameters in the constructor", () => {
        chai.expect(socketService.players.length).to.equal(0);
        chai.expect(socketService.rooms.length).to.equal(0);
    });

    describe("should determine if the user already exists", () => {
        const socketServiceTemp: MockSocketService = new MockSocketService();
        const player1: string = "Denis";
        const player2: string = "George";
        socketServiceTemp.players.push(player1);
        it("should return true if the user already exist", () => {
            chai.expect(socketServiceTemp.isUserAlreadyExist(player1)).to.equal(true);
        });
        it("should return false if the user doesnt exist yet", () => {
            chai.expect(socketServiceTemp.isUserAlreadyExist(player2)).to.equal(false);
        });
    });

    describe("SocketUser", () => {
        it("should create a user", () => {
            const player: string = "Fred";
            socketService.socketUser(player);
            chai.expect(socketService.players[0]).to.equal("Fred");
            chai.expect(socketService.players.length).to.equal(1);
        });
        it("should not create a user with the same name ", () => {
            const player: string = "Fred";
            socketService.socketUser(player);
            socketService.socketUser(player);
            chai.expect(socketService.players[0]).to.equal("Fred");
            chai.expect(socketService.players.length).to.equal(1);
        });
    });

    describe("SocketRoom", () => {
        const nameRoom: string = "jeu";
        const host: string = "Paul";
        const difficulty: string = "Easy";
        const grid: GridInterface = {
            _words: [],
            _letters: [],
            _difficulty: undefined
        };
        const nameRoom2: string = "juegos";
        const difficulty2: string = "Hard";
        const grid2: GridInterface = {
            _words: [],
            _letters: [],
            _difficulty: undefined
        };

        const room1: RoomInterface = {
            players: [],
            name: nameRoom,
            difficulty: difficulty,
            grid: grid,
            rematchs: []
        };
        const room2: RoomInterface = {
            players: [],
            name: nameRoom2,
            difficulty: difficulty2,
            grid: grid2,
            rematchs: []
        };
        describe("should determine if the room already exists", () => {
            const socketServiceTemp: MockSocketService = new MockSocketService();
            socketServiceTemp.rooms.push(room1);
            it("should return true if the room already exist", () => {
                chai.expect(socketServiceTemp.isRoomAlreadyExist(room1.name)).to.equal(true);
            });
            it("should return false if the room doesnt exist yet", () => {
                chai.expect(socketServiceTemp.isUserAlreadyExist(room2.name)).to.equal(false);
            });
        });

        it("should create a room correctly", () => {
            socketService.socketRoom(nameRoom, difficulty);
            chai.expect(socketService.rooms[0].name).to.equal(nameRoom);
            chai.expect(socketService.rooms[0].difficulty).to.equal(difficulty);
            chai.expect(socketService.rooms[0].grid).to.equal(undefined);
        });
        it("should not create a room if it already exist", () => {
            socketService.socketRoom(nameRoom, difficulty);
            chai.expect(socketService.rooms.length).to.equal(1);
            chai.expect(socketService.rooms[1]).to.equal(undefined);
        });

        describe("SocketJoinRoom", () => {
            const secondUser: string = "Nadia";
            const thirdUser: string = "Pauline";
            it("should join a room correctly", () => {
                socketService.socketJoinRoom(room1, host);
                socketService.socketJoinRoom(room1, secondUser);
                chai.expect(socketService.rooms[0].players[0]).to.equal("Paul");
                chai.expect(socketService.rooms[0].players[1]).to.equal("Nadia");
                chai.expect(socketService.rooms[0].players.length).to.equal(2);
            });
            it("should not add a third players if room is full (already two players in the room)", () => {
                socketService.socketJoinRoom(room1, thirdUser);
                chai.expect(socketService.rooms[0].players[2]).to.equal(undefined);
                chai.expect(socketService.rooms[0].players.length).to.equal(2);
            });
        });

        describe("should check if the room is full", () => {
            it("is should return true with 2 players", () => {
                chai.expect(socketService.checkIfRoomIsFull(room1)).to.equal(true);
            });
            it("is should return false with 1 players", () => {
                chai.expect(socketService.checkIfRoomIsFull(room2)).to.equal(false);
            });
        });

        describe("SocketRematch", () => {
            it("should verify if one player in the room request a rematch", () => {
                socketService.socketRematch(room1);
                chai.expect(room1.rematchs[0]).to.equal(true);
                chai.expect(room1.rematchs[1]).to.equal(undefined);
            });
            it("should verify if the two players in the room request a rematch", () => {
                socketService.socketRematch(room1);
                chai.expect(room1.rematchs[0]).to.equal(undefined);
                chai.expect(room1.rematchs[1]).to.equal(undefined);
            });
        });

        describe("Players should have the same grid in the room", () => {
            const letter1: LetterInterface = {
                _character: "a",
                _row: 1,
                _col: 2,
                _order: 1,
                _isBlank: false
            };
            const letter2: LetterInterface = {
                _character: "b",
                _row: 1,
                _col: 3,
                _order: 1,
                _isBlank: false
            };
            const letter3: LetterInterface = {
                _character: "c",
                _row: 1,
                _col: 4,
                _order: 1,
                _isBlank: false
            };
            const word0: WordInterface = {
                _definition: "blablabla",
                _index: 0,
                _isHorizontal: true,
                _letters: [letter1, letter2, letter3],
                _order: 1
            };

            const letter4: LetterInterface = {
                _character: "d",
                _row: 1,
                _col: 2,
                _order: 1,
                _isBlank: false
            };
            const letter5: LetterInterface = {
                _character: "e",
                _row: 1,
                _col: 3,
                _order: 1,
                _isBlank: false
            };
            const letter6: LetterInterface = {
                _character: "f",
                _row: 1,
                _col: 4,
                _order: 1,
                _isBlank: false
            };
            const word1: WordInterface = {
                _definition: "blabla",
                _index: 0,
                _isHorizontal: true,
                _letters: [letter4, letter5, letter6],
                _order: 1
            };
            grid._words.push(word0);
            grid._words.push(word1);

            it("should update the grid in the room (the same grid for two players)", () => {
                socketService.socketUpdateGrid(grid, room1);
                chai.expect(room1.grid).to.equal(grid);
                chai.expect(room1.grid._words[0]).to.equal(word0);
                chai.expect(room1.grid._words[1]).to.equal(word1);
            });
        });
    });
});
