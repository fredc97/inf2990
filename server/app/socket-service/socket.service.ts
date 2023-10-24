import "reflect-metadata";
import { injectable, } from "inversify";
import * as http from "http";
import * as socketIO from "socket.io";

import {
    MAX_PLAYERS, CREATE_ROOM, SET_USER, UPDATE, UPDATE_INITIALIZE, UPDATE_SECOND_PLAYER, REMATCH_RESPONSE,
    REMATCH, SET_OTHER_WORD, WORD_FOUND, REFRESH_ON_WORD_FOUND, SET_WORD,
    JOIN_ROOM, WAITING, LIST_ROOMS, ROOM_IS_FULL, ERROR_ROOM, ERROR_USER
} from "../../../common/crossword-constants";
import { RoomInterface } from "../../../common/interfaces/room-interface";
import { GridInterface } from "../../../common/interfaces/grid-interface";

const CONNECTION: string = "connection";

@injectable()
export class SocketService {
    private _ioSocketServer: SocketIO.Server;
    private _players: string[];
    private _rooms: RoomInterface[];

    public constructor() {
        this._players = [];
        this._rooms = [];
    }

    public listen(server: http.Server): void {
        this._ioSocketServer = socketIO(server);
        this._ioSocketServer.on(CONNECTION, (socket: SocketIO.Socket) => {
            this.socketRoom(socket);
            this.socketUser(socket);
            this.socketJoinRoom(socket);
            this.socketWaitingToConnect(socket);
            this.socketWordFound(socket);
            this.setWord(socket);
            this.socketRematch(socket);
            this.socketUpdateGrid(socket);
            this.socketGrid(socket);
        });
    }

    public socketUpdateGrid(socket: SocketIO.Socket): void {
        socket.on(UPDATE, (grid: GridInterface) => {
            for (const room of this._rooms) {
                for (const name in socket.rooms) {
                    if (name === room.name) {
                        room.grid = grid;
                        socket.to(name).emit(UPDATE_SECOND_PLAYER, grid);
                    }
                }
            }
        });
    }

    public socketGrid(socket: SocketIO.Socket): void {
        socket.on(UPDATE_INITIALIZE, (grid: GridInterface) => {
            this._ioSocketServer.emit(LIST_ROOMS, this._rooms);
            for (const room of this._rooms) {
                for (const name in socket.rooms) {
                    if (name === room.name) {
                        room.grid = grid;
                        this._ioSocketServer.in(name).emit(ROOM_IS_FULL, room);
                        this._ioSocketServer.emit(LIST_ROOMS, this._rooms);
                    }
                }
            }
        });
    }

    public socketRematch(socket: SocketIO.Socket): void {
        socket.on(REMATCH_RESPONSE, () => {
            for (const room of this._rooms) {
                for (const name in socket.rooms) {
                    if (name === room.name) {
                        room.rematchs.push(true);
                        if (room.rematchs[0] && room.rematchs[1]) {
                            socket.to(name).emit(REMATCH);
                            room.rematchs = [];
                        }
                    }
                }
            }
        });
    }

    public setWord(socket: SocketIO.Socket): void {
        socket.on(SET_WORD, (word: string) => {
            for (const room of this._rooms) {
                for (const name in socket.rooms) {
                    if (name === room.name) {
                        socket.broadcast.to(name).emit(SET_OTHER_WORD, word);
                    }
                }
            }
        });
    }

    public socketWordFound(socket: SocketIO.Socket): void {
        socket.on(WORD_FOUND, (mot: string) => {
            for (const room of this._rooms) {
                for (const name in socket.rooms) {
                    if (name === room.name) {
                        socket.broadcast.to(name).emit(REFRESH_ON_WORD_FOUND, mot);
                    }
                }
            }
        });
    }

    public socketJoinRoom(socket: SocketIO.Socket): void {
        socket.on(JOIN_ROOM, (selectedRoom: RoomInterface, userName: string) => {
            if (!this.checkIfRoomIsFull(selectedRoom)) {
                socket.join(selectedRoom.name);
                for (const room of this._rooms) {
                    if (room.name === selectedRoom.name) {
                        let isExist: boolean = false;
                        for (const user of room.players) {
                            if (user === userName) {
                                isExist = true;
                            }
                        }
                        if (!isExist) {
                            room.players.push(userName);
                        }
                        this._ioSocketServer.to(selectedRoom.name).emit(ROOM_IS_FULL, room);
                        if (room.players.length === 2) {
                            this._ioSocketServer.emit(LIST_ROOMS, this._rooms);
                        }
                    }
                }
            }
        });
    }

    public socketWaitingToConnect(socket: SocketIO.Socket): void {
        socket.on(WAITING, (selectedRoom: RoomInterface) => {
            for (const room of this._rooms) {
                if (room.name === selectedRoom.name) {
                    this._ioSocketServer.in(selectedRoom.name).emit(ROOM_IS_FULL, room);
                }
            }
        });
    }

    public socketRoom(socket: SocketIO.Socket): void {
        socket.on(CREATE_ROOM, (name: string, difficulty: string) => {
            const isRoomExist: boolean = this.isRoomAlreadyExist(name);
            const roomTemp: RoomInterface = {
                players: [],
                name: name,
                difficulty: difficulty,
                grid: undefined,
                rematchs: []
            };
            if (!isRoomExist) {
                this._rooms.push(roomTemp);
            }
            socket.emit(ERROR_ROOM, isRoomExist, roomTemp);
        });
    }

    public socketUser(socket: SocketIO.Socket): void {
        socket.on(SET_USER, (player: string) => {
            const isUserExist: boolean = this.isUserAlreadyExist(player);
            if (!isUserExist) {
                this._players.push(player);
            }
            socket.emit(ERROR_USER, isUserExist);
            this._ioSocketServer.emit(LIST_ROOMS, this._rooms);
        });
    }

    public isRoomAlreadyExist(name: string): boolean {
        let isExist: boolean = false;
        for (const room of this._rooms) {
            if (room.name === name) {
                isExist = true;
            }
        }

        return isExist;
    }

    public isUserAlreadyExist(player: string): boolean {
        let isExist: boolean = false;
        for (const user of this._players) {
            if (user === player) {
                isExist = true;
            }
        }

        return isExist;
    }

    public checkIfRoomIsFull(selectedRoom: RoomInterface): boolean {
        let isFull: boolean = false;
        for (const room of this._rooms) {
            if (room.name === selectedRoom.name) {
                if (room.players.length === MAX_PLAYERS) {
                    isFull = true;
                }
            }
        }

        return isFull;
    }

    public get players(): string[] {
        return this._players;
    }

    public get rooms(): RoomInterface[] {
        return this._rooms;
    }
}
