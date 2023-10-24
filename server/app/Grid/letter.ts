import { EMPTY } from "../../../common/crossword-constants";

export class Letter {
    private _character: string;
    private _row: number;
    private _col: number;
    private _order: number;
    private _isBlank: boolean;

    public constructor(row: number, col: number) {
        this._character = EMPTY;
        this._row = row;
        this._col = col;
        this._isBlank = true;
        this._order = 0;
    }

    public get character(): string {
        return this._character;
    }
    public set character(character: string) {
        this._character = character;
    }
    public get row(): number {
        return this._row;
    }
    public get col(): number {
        return this._col;
    }
    public get order(): number {
        return this._order;
    }
    public set order(order: number) {
        this._order = order;
    }
    public get isBlank(): boolean {
        return this._isBlank;
    }
    public set isBlank(blank: boolean) {
        this._isBlank = blank;
    }
}
