import { Injectable } from "@angular/core";
import * as socketClient from "socket.io-client";
import {
    CREATE_ROOM, SET_USER, JOIN_ROOM, WAITING, WORD_FOUND,
    SET_WORD, UPDATE, UPDATE_INITIALIZE
} from "../../../../../common/crossword-constants";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";
import { RoomInterface } from "../../../../../common/interfaces/room-interface";

const SERVER: string = "http://localhost:3000";

@Injectable()
export class SocketClientService {
    private ioSocketClient: SocketIOClient.Socket;
    public constructor() {
        this.ioSocketClient = socketClient(SERVER);
    }

    public get socketClient(): SocketIOClient.Socket {
        return this.ioSocketClient;
    }

    public setSocketClient(server: string): void {
        this.ioSocketClient = socketClient(server);
    }

    public emitJoinRoom(room: RoomInterface, user: string): void {
        this.ioSocketClient.emit(JOIN_ROOM, room, user);
    }

    public emitGridInit(grid: GridInterface): void {
        this.ioSocketClient.emit(UPDATE_INITIALIZE, grid);
    }

    public emitGridAfterRematch(grid: GridInterface): void {
        this.ioSocketClient.emit(UPDATE, grid);
    }

    public emitRoom(nameRoom: string, actualDifficulty: string): void {
        this.ioSocketClient.emit(CREATE_ROOM, nameRoom, actualDifficulty);
    }

    public emitWaitingHost(room: RoomInterface): void {
        this.ioSocketClient.emit(WAITING, room);
    }

    public emitUser(nameUser: string): void {
        this.ioSocketClient.connect();
        this.ioSocketClient.emit(SET_USER, nameUser);
    }

    public emitWordFound(word: string): void {
        this.ioSocketClient.emit(WORD_FOUND, word);
    }
    public emitOtherWord(word: string): void {
        this.ioSocketClient.emit(SET_WORD, word);
    }
}
