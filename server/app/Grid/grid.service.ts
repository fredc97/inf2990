import { Letter } from "./letter";
import { Word } from "./word";
import { MiniGrid } from "./miniGrid";
import {
    MINI_GRID_DIMENSION, ORIGIN_MINI_GRID_THREE, ORIGIN_MINI_GRID_FOUR, EASY,
    GRID_ZERO, GRID_ONE, GRID_TWO, GRID_THREE
} from "./crossword-backend-constants";

import { DIMENSION } from "../../../common/crossword-constants";

const ORIGIN_MINI_GRID_ONE: number[] = [0, 0];
const ORIGIN_MINI_GRID_TWO: number[] = [0, MINI_GRID_DIMENSION];
export class GridService {
    private _words: Word[];
    private _letters: Letter[][];
    private _miniGrids: MiniGrid[];
    private _difficulty: number;
    private _indexes: number[];

    public constructor() {
        this._words = [];
        this._miniGrids = [];
        this._letters = [];
        this._indexes = [];
        this._difficulty = EASY;
        this.initializeLetters();
    }

    public async returnFilledGrid(difficulty: number): Promise<GridService> {
        this._difficulty = difficulty;
        this.createMiniGrids();
        if (this._miniGrids[0].makeFiftyFifty()) {
            const filledMiniGridZero: Promise<void> = this._miniGrids[GRID_ZERO].fillPatternA();
            const filledMiniGridOne: Promise<void> = this._miniGrids[GRID_ONE].fillPatternB();
            const filledMiniGridTwo: Promise<void> = this._miniGrids[GRID_TWO].fillPatternB();
            const filledMiniGridThree: Promise<void> = this._miniGrids[GRID_THREE].fillPatternA();

            return Promise.all([filledMiniGridZero, filledMiniGridOne, filledMiniGridTwo, filledMiniGridThree]).then(() => {
                this.setIndex();
                this.transpose();

                return this;
            });
        } else {
            const filledMiniGridZero: Promise<void> = this._miniGrids[GRID_ZERO].fillPatternB();
            const filledMiniGridOne: Promise<void> = this._miniGrids[GRID_ONE].fillPatternA();
            const filledMiniGridTwo: Promise<void> = this._miniGrids[GRID_TWO].fillPatternA();
            const filledMiniGridThree: Promise<void> = this._miniGrids[GRID_THREE].fillPatternB();

            return Promise.all([filledMiniGridZero, filledMiniGridOne, filledMiniGridTwo, filledMiniGridThree]).then(() => {
                this.setIndex();
                this.transpose();

                return this;
            });
        }
    }

    public createMiniGrids(): void {
        this._miniGrids.push(new MiniGrid(this.passLetters(ORIGIN_MINI_GRID_ONE), this._words, this._difficulty));
        this._miniGrids.push(new MiniGrid(this.passLetters(ORIGIN_MINI_GRID_TWO), this._words, this._difficulty));
        this._miniGrids.push(new MiniGrid(this.passLetters(ORIGIN_MINI_GRID_THREE), this._words, this._difficulty));
        this._miniGrids.push(new MiniGrid(this.passLetters(ORIGIN_MINI_GRID_FOUR), this._words, this._difficulty));
    }

    private passLetters(origins: number[]): Letter[][] {
        const letters: Letter[][] = [];
        for (let row: number = 0; row < MINI_GRID_DIMENSION; row++) {
            letters[row] = [];
            for (let col: number = 0; col < MINI_GRID_DIMENSION; col++) {
                letters[row][col] = this._letters[row + origins[0]][col + origins[1]];
            }
        }

        return letters;
    }

    private setIndex(): void {
        this.setHorizontalIndex();
        this.setVerticalIndex();
        this._words.sort((firstWord: Word, secondWord: Word) => {
            return firstWord.index - secondWord.index;
        });
    }

    private setHorizontalIndex(): void {
        this._words.sort((firstWord: Word, secondWord: Word) => {
            return firstWord.letters[0].row - secondWord.letters[0].row;
        });
        let counter: number = 1;
        for (const word of this._words) {
            if (word.isHorizontal) {
                word.index = counter;
                for (const verticalWord of this._words) {
                    const sameRow: boolean = (verticalWord.letters[0].row) === (word.letters[0].row);
                    const sameCol: boolean = (verticalWord.letters[0].col) === (word.letters[0].col);
                    if (!verticalWord.isHorizontal && sameRow && sameCol) {
                        verticalWord.index = counter;
                        this._indexes.push(counter);
                    }
                }
                counter++;
            }
        }
    }

    private setVerticalIndex(): void {
        this._words.sort((firstWord: Word, secondWord: Word) => {
            return firstWord.letters[0].col - secondWord.letters[0].col;
        });
        let counter: number = 1;
        for (const word of this._words) {
            if (!word.isHorizontal) {
                if (word.index !== 0) {
                    continue;
                } else {
                    for (const index of this._indexes) {
                        if (index === counter) {
                            counter++;
                        }
                    }
                    word.index = counter;
                    counter++;
                }
            }
        }
    }

    private transpose(): void {
        if (this._miniGrids[0].makeFiftyFifty()) {
            const letters: Letter[][] = [];
            for (let row: number = 0; row < DIMENSION; row++) {
                letters.push([]);
            }
            for (let row: number = 0; row < DIMENSION; row++) {
                for (let col: number = 0; col < DIMENSION; col++) {
                    letters[col].push(this._letters[row][col]);
                }
            }
            this._letters = letters;
            this.reverseOrientation();
        }
    }

    private reverseOrientation(): void {
        for (const word of this._words) {
            word.isHorizontal = !word.isHorizontal;
        }
    }

    public initializeLetters(): void {
        for (let row: number = 0; row < DIMENSION; row++) {
            this._letters[row] = [];
            for (let col: number = 0; col < DIMENSION; col++) {
                this._letters[row][col] = new Letter(row, col);
            }
        }
    }

    public get words(): Word[] {
        return this._words;
    }

    public get letters(): Letter[][] {
        return this._letters;
    }

    public set difficulty(difficulty: number) {
        this._difficulty = difficulty;
    }

    public get difficulty(): number {
        return this._difficulty;
    }

    public get miniGrids(): MiniGrid[] {
        return this._miniGrids;
    }
}
