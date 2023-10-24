import "reflect-metadata";
import { RoomInterface } from "../../../common/interfaces/room-interface";
import { GridInterface } from "../../../common/interfaces/grid-interface";

const MAX_PLAYERS: number = 2;
export class MockSocketService {
    private _players: string[];
    private _rooms: RoomInterface[];

    public constructor() {
        this._players = [];
        this._rooms = [];
    }

    public socketUpdateGrid(grid: GridInterface, aRoom: RoomInterface): void {
        for (const room of this._rooms) {
            if (aRoom.name === room.name) {
                room.grid = grid;
            }
        }
    }

    public socketRematch(room: RoomInterface): void {
        room.rematchs.push(true);
        if (room.rematchs[0] && room.rematchs[1]) {
            room.rematchs = [];
        }
    }

    public socketJoinRoom(selectedRoom: RoomInterface, player: string): void {
        if (!this.checkIfRoomIsFull(selectedRoom)) {
            for (const room of this._rooms) {
                if (room.name === selectedRoom.name) {
                    let isExist: boolean = false;
                    for (const user of room.players) {
                        if (user === player) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        room.players.push(player);
                    }
                }
            }
        }
    }

    public socketRoom(name: string, difficulty: string): void {
        const isRoomExist: boolean = this.isRoomAlreadyExist(name);
        const roomTemp: RoomInterface = {
            name: name,
            players: [],
            difficulty: difficulty,
            grid: undefined,
            rematchs: []
        };
        if (!isRoomExist) {
            this._rooms.push(roomTemp);
        }
    }

    public socketUser(player: string): void {
        const isUserExist: boolean = this.isUserAlreadyExist(player);
        if (!isUserExist) {
            this._players.push(player);
        }
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
