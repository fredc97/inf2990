import { Letter } from "./letter";
import { EMPTY } from "../../../common/crossword-constants";

const POSSIBLE_ACCENTS: string = "ÀÁÂÃÄàáâäÒÓÔÕÕÖòóôõöÈÉÊËèéêëÇçÌÍÎÏìíîïÙÚÛÜùúûüÑñŸÿý";
const CONVERTED_ACCENTS: string = "AAAAAaaaaOOOOOOoooooEEEEeeeeCcIIIIiiiiUUUUuuuuNnYyy";
const HYPHEN: string = "-";
const UNDERSCORE: string = "_";
const APOSTROPHE: string = "'";

export class Word {
    private _index: number;
    private _isHorizontal: boolean;
    private _letters: Letter[];
    private _order: number;
    private _definition: string;

    public constructor(isHorizontal: boolean) {
        this._isHorizontal = isHorizontal;
        this._index = 0;
        this._letters = [];
        this._order = 0;
        this._definition = EMPTY;
    }

    public replaceAccents(word: string): string {
        const removedAccents: string[] = word.split(EMPTY);
        let index: number;
        for (let letter: number = 0; letter < word.length; letter++) {
            if ((index = POSSIBLE_ACCENTS.indexOf(word[letter])) !== -1) {
                removedAccents[letter] = CONVERTED_ACCENTS[index];
            }
        }

        return removedAccents.join(EMPTY);
    }

    public ignoreRepresentation(word: string): string {
        let ignoredRepresentation: string = EMPTY;
        for (const letter of word) {
            if (letter === HYPHEN || letter === UNDERSCORE || letter === APOSTROPHE) {
                continue;
            } else {
                ignoredRepresentation += letter;
            }
        }

        return ignoredRepresentation;
    }

    public addLetters(word: string, order: number): void {
        const replacedWord: string = this.replaceAccents(word);

        for (let position: number = 0; position < replacedWord.length; position++) {
            if (this._letters[position].character === EMPTY) {
                this._letters[position].character = replacedWord[position];
                this._letters[position].order = order;
                this._letters[position].isBlank = false;
            }
        }
        this._order = order;
    }

    public toString(): string {
        let wordAsString: string = EMPTY;
        for (const letter of this._letters) {
            wordAsString += letter.character;
        }

        return wordAsString;
    }
    public get index(): number {
        return this._index;
    }
    public set index(index: number) {
        this._index = index;
    }
    public get isHorizontal(): boolean {
        return this._isHorizontal;
    }
    public set isHorizontal(isHorizontal: boolean) {
        this._isHorizontal = isHorizontal;
    }
    public get letters(): Letter[] {
        return this._letters;
    }
    public set letters(letters: Letter[]) {
        this._letters = letters;
    }
    public get order(): number {
        return this._order;
    }
    public set order(order: number) {
        this._order = order;
    }
    public get definition(): string {
        return this._definition;
    }
    public set definition(definition: string) {
        this._definition = definition;
    }
}
