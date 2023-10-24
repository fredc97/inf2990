import { TestBed, inject } from "@angular/core/testing";
import * as io from "socket.io-client";
import { SocketClientService } from "./socketClient.service";
import {
    SET_USER, CREATE_ROOM, JOIN_ROOM, WORD_FOUND,
    SET_WORD, WAITING, UPDATE_INITIALIZE, UPDATE, EMPTY
} from "../../../../../common/crossword-constants";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";
import { RoomInterface } from "../../../../../common/interfaces/room-interface";
const SERVER: string = "http://localhost:9876";
const CONNECTION: string = "connection";

describe("SocketClientService", () => {

    const grid: GridInterface = {
        _words: [],
        _letters: [],
        _difficulty: 0
    };
    const word: string = "apple";
    const userName: string = "fred";
    const roomName: string = "game";
    const difficulty: string = "Easy";
    const room: RoomInterface = {
        players: [],
        name: EMPTY,
        difficulty: EMPTY,
        grid: undefined,
        rematchs: []
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SocketClientService]
        });
        const socket: SocketIOClient.Socket = io(SERVER);
        socket.on(CONNECTION, () => {
        });
        socket.on(SET_USER, (name: string) => {
        });
        socket.on(CREATE_ROOM, (host: string, aRoom: string, diff: string) => {
        });
        socket.on(JOIN_ROOM, (aRoom: RoomInterface, user: string) => {
        });
        socket.on(WORD_FOUND, (aWord: string) => {
        });
        socket.on(SET_WORD, (aWord: string) => {
        });
        socket.on(WAITING, (aRoom: RoomInterface) => {
        });
        socket.on(UPDATE_INITIALIZE, (aGrid: GridInterface) => {
        });
        socket.on(UPDATE, (aGrid: GridInterface) => {
        });
    });

    it("should return true when it receives the event SET_USER", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(SET_USER, () => {
            expect(name).toEqual(userName);
        });
        socketService.emitUser(userName);
    }));

    it("should return true when it receives the event CREATE_ROOM", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(CREATE_ROOM, (host: string, aRoom: string, diff: string) => {
            expect(host).toEqual(userName);
            expect(aRoom).toEqual(roomName);
            expect(diff).toEqual(difficulty);
        });
        socketService.emitRoom(roomName, difficulty);
    }));

    it("should return true when it receives the event JOIN_ROOM", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(JOIN_ROOM, (aRoom: RoomInterface, user: string) => {
            expect(aRoom).toEqual(room);
            expect(user).toEqual(userName);
        });
        socketService.emitJoinRoom(room, userName);
    }));

    it("should return true when it receives the event WORD_FOUND", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(WORD_FOUND, (aWord: string) => {
            expect(aWord).toEqual(word);
        });
        socketService.emitWordFound(word);
    }));

    it("should return true when it receives the event SET_WORD", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(SET_WORD, (aWord: string) => {
            expect(aWord).toEqual(word);
        });
        socketService.emitOtherWord(word);
    }));

    it("should return true when it receives the event WAITING", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(WAITING, (aRoom: RoomInterface) => {
            expect(aRoom.name).toEqual(room.name);
        });
        socketService.emitWaitingHost(room);
    }));

    it("should return true when it receives the event UPDATE_INIT", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(UPDATE_INITIALIZE, (aGrid: GridInterface) => {
            expect(aGrid._words).toEqual(grid._words);
        });
        socketService.emitGridInit(grid);
    }));

    it("should return true when it receives the event UPDATE_INIT", inject([SocketClientService], (socketService: SocketClientService) => {
        socketService["ioSocketClient"] = io(SERVER);
        socketService.socketClient.on(UPDATE, (aGrid: GridInterface) => {
            expect(aGrid._words).toEqual(grid._words);
        });
        socketService.emitGridAfterRematch(grid);
    }));
});
