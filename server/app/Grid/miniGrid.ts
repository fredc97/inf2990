
import { Letter } from "./letter";
import { Word } from "./word";
import { WordManipulator } from "./wordManipulator";
import {
    IS_HORIZONTAL, ORIGIN_MINI_GRID_THREE, ORIGIN_MINI_GRID_FOUR, FIFTY_FIFY,
    NORMAL, HARD, ANY, ENDSTART, STARTEND, STARTSTART, ENDEND
} from "./crossword-backend-constants";

const TO_ZERO: number = 0;
const TO_ONE: number = 1;
const TO_TWO: number = 2;
const TO_THREE: number = 3;
const TO_FOUR: number = 4;
const LINE_ZERO: number = 0;
const LINE_ONE: number = 1;
const LINE_TWO: number = 2;
const LINE_THREE: number = 3;
const LINE_FOUR: number = 4;
const LENGTH_TWO: number = 2;
const LENGTH_THREE: number = 3;
const LENGTH_FOUR: number = 4;
export class MiniGrid {

    private _difficulty: number;
    private _letters: Letter[][];
    private _words: Word[];
    private _wordManipulator: WordManipulator;
    private _orientation: boolean;
    private _isLeft: boolean;
    private _allWords: Word[];

    public constructor(letters: Letter[][], words: Word[], difficulty: number) {
        this._difficulty = difficulty;
        this._letters = letters;
        this._words = [];
        this._wordManipulator = new WordManipulator(this._words, difficulty);
        this._orientation = IS_HORIZONTAL;
        this._isLeft = true;
        this._allWords = words;
    }

    public async fillPatternA(): Promise<void> {
        this._orientation = !IS_HORIZONTAL;

        return this.insertWord([TO_ZERO, TO_ONE], LINE_ZERO, ANY).then(async () => {
            return this.insertWord([TO_ZERO, TO_TWO], LINE_ONE, ENDSTART);
        }).then(async () => {
            return this.insertWord([TO_ONE, TO_THREE], LINE_TWO, ENDSTART);
        }).then(async () => {
            const dependency: string = this.chooseRandomDependency();
            const points: [number, number] = this.chooseRandomPoints(dependency);

            return this.insertWord(points, LINE_THREE, dependency);
        }).then(async () => {
            let max: number = 1;
            if (this._isLeft) {
                max = this.getRandomNumber(LINE_ONE, LINE_FOUR);
            }

            return this.insertWord([TO_ZERO, max], LINE_FOUR, ANY);
        });
    }

    public async fillPatternB(): Promise<void> {
        this._orientation = IS_HORIZONTAL;

        return this.insertWord([TO_THREE, TO_FOUR], LINE_TWO, ANY).then(async () => {
            return this.insertWord([TO_ZERO, TO_TWO], LINE_THREE, STARTEND);
        }).then(async () => {
            return this.insertWord([TO_ONE, TO_THREE], LINE_ZERO, STARTEND);
        }).then(async () => {
            return this.insertWord([TO_ZERO, TO_FOUR], LINE_ONE, STARTSTART);
        }).then(async () => {
            let max: number = this.getRandomNumber(LENGTH_TWO, LENGTH_THREE);
            const currentOrigin: [number, number] = [this._letters[0][0].row, this._letters[0][0].col];
            if (currentOrigin === ORIGIN_MINI_GRID_THREE || currentOrigin === ORIGIN_MINI_GRID_FOUR) {
                max = this.getRandomNumber(LENGTH_TWO, LENGTH_FOUR);
            }

            return this.insertWord([TO_ONE, max], LINE_FOUR, ENDSTART);
        });
    }

    public selectDefinition(definitions: string): string {
        if (this._difficulty === NORMAL || this._difficulty === HARD) {
            if (definitions.length < LENGTH_TWO) {
                return definitions[definitions.length - 1];
            } else {
                return definitions[this.getRandomNumber(1, definitions.length - 1)];
            }
        }

        return definitions[0];
    }

    private chooseRandomPoints(dependency: string): [number, number] {
        if (dependency === ENDSTART) {
            this._isLeft = false;
            if (this.makeFiftyFifty()) {
                return [TO_TWO, TO_FOUR];
            } else {
                return [TO_TWO, TO_THREE];
            }
        } else {
            this._isLeft = true;
            if (this.makeFiftyFifty()) {
                return [TO_ZERO, TO_TWO];
            } else {
                return [TO_ONE, TO_TWO];
            }
        }
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private async insertWord(
        points: [number, number], line: number, dependency: string): Promise<void> {
        const word: Word = this.createWord(points, line);
        await this.insertWordAndDefinition(word, points, dependency);
    }

    private async insertWordAndDefinition(word: Word, points: [number, number], dependency: string): Promise<void> {
        let isUndefined: boolean = true;
        let order: number = 0;
        while (isUndefined) {
            await this._wordManipulator.getWord(points[1] - points[0] + 1, dependency).then(async (str: string) => {
                await this._wordManipulator.getDef(str).then((def: string) => {
                    if (def[0] !== undefined) {
                        let toAddWordString: string = str;
                        toAddWordString = word.replaceAccents(toAddWordString);
                        toAddWordString = word.ignoreRepresentation(toAddWordString);
                        if (this.searchDoppelganger(toAddWordString)) {
                            isUndefined = true;
                        } else {
                            word.addLetters(toAddWordString, order);
                            word.definition = this.selectDefinition(def);
                            word.order = order;
                            this._words.push(word);
                            this._allWords.push(word);
                            this._orientation = !this._orientation;
                            order++;
                            isUndefined = false;
                        }
                    }
                });
            });
        }
    }

    public searchDoppelganger(word: string): boolean {
        for (const wordToFind of this._allWords) {
            if (wordToFind.toString() === word) {
                return true;
            }
        }

        return false;
    }

    public createWord(points: [number, number], line: number): Word {
        let word: Word;
        if (this._orientation === IS_HORIZONTAL) {
            word = new Word(IS_HORIZONTAL);
            for (let col: number = points[0]; col < points[1] + 1; col++) {
                word.letters.push(this._letters[line][col]);
            }
        } else {
            word = new Word(!IS_HORIZONTAL);
            for (let row: number = points[0]; row < points[1] + 1; row++) {
                word.letters.push(this._letters[row][line]);
            }
        }

        return word;
    }

    private chooseRandomDependency(): string {
        if (this.makeFiftyFifty()) {
            return ENDSTART;
        }

        return ENDEND;
    }

    public makeFiftyFifty(): boolean {
        if ((Math.floor(Math.random() * FIFTY_FIFY)) === 1) {
            return true;
        }

        return false;
    }

    public get wordManipulator(): WordManipulator {
        return this._wordManipulator;
    }

    public get letters(): Letter[][] {
        return this._letters;
    }

    public get words(): Word[] {
        return this._words;
    }

    public get allWords(): Word[] {
        return this._allWords;
    }
}
