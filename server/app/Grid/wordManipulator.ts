
import * as requestPromise from "request-promise";
import { Word } from "./word";
import { HARD, ANY, STARTSTART, STARTEND, ENDSTART, ENDEND, UNCOMMON, COMMON } from "./crossword-backend-constants";
import { EMPTY } from "../../../common/crossword-constants";
const API_WORD_URL: string = "http://localhost:3000/api/lexicalService/randomWordByLettersAndLengthMax/";
const API_DEFINITION_URL: string = "http://localhost:3000/api/lexicalService/definition/";
const ONLY_LETTERS: string = "[a-z]";
const ANYTHING: string = "/^";
const SLASH: string = "/";

export class WordManipulator {
    private _words: Word[];
    private _difficulty: number;
    private _type: string;

    public constructor(words: Word[], difficulty: number) {
        this._words = words;
        this._difficulty = difficulty;
        (difficulty === HARD) ? this._type = UNCOMMON : this._type = COMMON;
    }

    public async getDef(word: string): Promise<string> {
        return requestPromise(API_DEFINITION_URL + word).then((def: string) => {
            return JSON.parse(def);
        });
    }

    public async getWord(length: number, option: string): Promise<string> {
        try {
            switch (option) {
                case ANY: {
                    return requestPromise(API_WORD_URL + this.getAnyWord(length)).then((word: string) => JSON.parse(word));
                }
                case STARTSTART: {
                    return requestPromise(API_WORD_URL + this.getStartStartWord(length)).then((word: string) => JSON.parse(word));
                }
                case STARTEND: {
                    return requestPromise(API_WORD_URL + this.getStartEndWord(length)).then((word: string) => JSON.parse(word));
                }
                case ENDSTART: {
                    return requestPromise(API_WORD_URL + this.getEndStartWord(length)).then((word: string) => JSON.parse(word));
                }
                case ENDEND: {
                    return requestPromise(API_WORD_URL + this.getEndEnd(length)).then((word: string) => JSON.parse(word));
                }
                default: {
                    return EMPTY;
                }
            }
        } catch (error) {
            return EMPTY;
        }
    }

    public getAnyWord(length: number): string {
        let add: string = this._type + ANYTHING;
        for (let emptyLetter: number = 0; emptyLetter < length; emptyLetter++) {
            add += ONLY_LETTERS;
        }
        add += SLASH + length;

        return add;
    }

    public getEndStartWord(length: number): string {
        let add: string = this._type + ANYTHING;
        add += this.obtainLastCharacter();
        for (let emptyLetter: number = 1; emptyLetter < length; emptyLetter++) {
            add += ONLY_LETTERS;
        }
        add += SLASH + length;

        return add;
    }

    public getStartStartWord(length: number): string {
        let add: string = this._type + ANYTHING;
        add += this.obtainFirstCharacter();
        for (let emptyLetter: number = 1; emptyLetter < length; emptyLetter++) {
            add += ONLY_LETTERS;
        }
        add += SLASH + length;

        return add;
    }

    public getStartEndWord(length: number): string {
        let add: string = this._type + ANYTHING;
        for (let emptyLetter: number = 0; emptyLetter < length; emptyLetter++) {
            if (emptyLetter < length - 1) {
                add += ONLY_LETTERS;
            } else {
                add += this.obtainFirstCharacter();
            }
        }
        add += SLASH + length;

        return add;
    }

    public getEndEnd(length: number): string {
        let add: string = this._type + ANYTHING;
        for (let emptyLetter: number = 0; emptyLetter < length; emptyLetter++) {
            if (emptyLetter < length - 1) {
                add += ONLY_LETTERS;
            } else {
                add += this.obtainLastCharacter();
            }
        }
        add += SLASH + length;

        return add;
    }

    private obtainLastCharacter(): string {
        return this._words[this._words.length - 1].letters[this._words[this._words.length - 1].letters.length - 1].character;
    }

    private obtainFirstCharacter(): string {
        return this._words[this._words.length - 1].letters[0].character;
    }

    public get type(): string {
        return this._type;
    }

    public get difficulty(): number {
        return this._difficulty;
    }

    public get words(): Word[] {
        return this._words;
    }
}
