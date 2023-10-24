import { Component, OnInit } from "@angular/core";
import { GridService } from "../../app/cross-word/grid/grid.service";
import { CrosswordService } from "../cross-word/grid/crossword.service";
import { EMPTY, MAX_PLAYERS, LIST_ROOMS, ROOM_IS_FULL, ERROR_ROOM, ERROR_USER } from "../../../../common/crossword-constants";
import { SocketClientService } from "../cross-word/grid/socketClient.service";
import { MessageInterface } from "../cross-word/interfaces/message-interface";
import { RoomInterface } from "../../../../common/interfaces/room-interface";
import { GridInterface } from "../../../../common/interfaces/grid-interface";

const NORMAL: string = "Normal";
const HARD: string = "Hard";
const ONE: string = "One Player";
@Component({
    selector: "app-crossword-setting",
    templateUrl: "./crossword-setting.component.html",
    styleUrls: ["./crossword-setting.component.css"]
})

export class CrosswordSettingComponent implements OnInit {

    private _selectedDifficulty: string;
    private _selectedNumber: string;
    private _selectedUser: string;
    private _userNames: string[];
    private _selectedRoom: RoomInterface;
    private _listRooms: RoomInterface[];
    private _message: MessageInterface;

    public constructor(private _socketClientService?: SocketClientService, private _gridService?: GridService,
                       private _crossword?: CrosswordService) {
        this._selectedDifficulty = EMPTY;
        this._selectedUser = EMPTY;
        this._selectedNumber = EMPTY;
        this._userNames = [];
        this._selectedRoom = undefined;
        this._listRooms = [];
        this._message = {
            _error: {
                _isRoomFull: false,
                _isRoomExist: false,
                _isUserExist: false
            },
            _popUp: {
                _isCreatingGrid: false,
                _isWaitingPlayer: false
            }
        };
    }

    public ngOnInit(): void {
        this.getListOfRooms();
    }

    public checkIndexDifficulty(difficulty: string): number {
        let indexDifficulty: number;
        switch (difficulty) {
            case NORMAL: {
                indexDifficulty = 1;
                break;
            }
            case HARD: {
                indexDifficulty = 2;
                break;
            }
            default: {
                indexDifficulty = 0;
                break;
            }
        }

        return indexDifficulty;
    }

    public onSelectedDifficulty(selectedDifficulty: string): void {
        if (this._selectedNumber === ONE) {
            this._message._popUp._isCreatingGrid = true;
            this._gridService.get(this.checkIndexDifficulty(selectedDifficulty)).then((grid: GridInterface) => {
                this._crossword.grid = grid;
                this._selectedDifficulty = selectedDifficulty;
                this._message._popUp._isCreatingGrid = false;
            }).catch((error) => console.error(error));
        }
        this._selectedDifficulty = selectedDifficulty;
    }

    public getListOfRooms(): void {
        this._socketClientService.socketClient.on(LIST_ROOMS, (rooms: RoomInterface[]) => {
            this._listRooms = rooms;
        });
    }

    public selectRoom(room: RoomInterface): void {
        if (!(room.players.length === MAX_PLAYERS)) {
            this.joinRoom(room);
            this._selectedRoom = room;
            this._userNames = room.players;
            this._message._error._isRoomFull = false;
        } else {
            this._message._error._isRoomFull = true;
        }
    }

    public verifyAvailability(room: RoomInterface): void {
        if (room.players.length < MAX_PLAYERS) {
            this._message._popUp._isWaitingPlayer = true;
        } else {
            this._message._popUp._isCreatingGrid = true;
            this._message._popUp._isWaitingPlayer = false;
            this._selectedRoom = room;
            this._userNames = room.players;
            if (this._crossword !== undefined) {
                this._crossword.grid = room.grid;
            }
        }
    }

    public joinRoom(room: RoomInterface): void {
        this._socketClientService.emitWaitingHost(room);
        this._socketClientService.socketClient.on(ROOM_IS_FULL, (selectedRoom: RoomInterface) => {
            this.verifyAvailability(selectedRoom);
        });
        this._socketClientService.emitJoinRoom(room, this._selectedUser);
    }

    public createRoom(roomName: string): void {
        this._message._popUp._isCreatingGrid = true;
        this._socketClientService.emitRoom(roomName, this._selectedDifficulty);
        this._socketClientService.socketClient.on(ERROR_ROOM, (isRoomExist: boolean, room: RoomInterface) => {
            if (isRoomExist) {
                this._message._error._isRoomExist = true;
            } else {
                this._gridService.get(this.checkIndexDifficulty(this._selectedDifficulty)).then((grid: GridInterface) => {
                    this._socketClientService.emitGridInit(grid);
                    this._message._error._isRoomExist = false;
                    this._message._popUp._isCreatingGrid = false;
                }).catch((error) => console.error(error));
                this.joinRoom(room);
            }
        });
    }

    public selectUser(user: string): void {
        this._socketClientService.emitUser(user);
        this._socketClientService.socketClient.on(ERROR_USER, (isUserExist: boolean) => {
            if (isUserExist) {
                this._message._error._isUserExist = true;
            } else {
                this._message._error._isUserExist = false;
                this._selectedUser = user;
            }
        });

    }

    public onSelectedNumber(selectedNumber: string): void {
        this._selectedNumber = selectedNumber;
    }

    public get message(): MessageInterface {
        return this._message;
    }
    public get selectedNumber(): string {
        return this._selectedNumber;
    }
    public set selectedNumber(selectedNumber: string) {
        this._selectedNumber = selectedNumber;
    }
    public get selectedDifficulty(): string {
        return this._selectedDifficulty;
    }
    public set selectedDifficulty(selectedDifficulty: string) {
        this._selectedDifficulty = selectedDifficulty;
    }
    public get selectedUser(): string {
        return this._selectedUser;
    }
    public get crossword(): CrosswordService {
        return this._crossword;
    }
    public get selectedRoom(): RoomInterface {
        return this._selectedRoom;
    }
    public set selectedRoom(selectedRoom: RoomInterface) {
        this._selectedRoom = selectedRoom;
    }
}
