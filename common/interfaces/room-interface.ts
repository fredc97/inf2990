import { GridInterface } from "./grid-interface";

export interface RoomInterface {
    players: string[];
    name: string;
    difficulty: string;
    grid: GridInterface;
    rematchs: boolean[];
}