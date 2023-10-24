import { Injectable, ElementRef } from "@angular/core";
import { DIMENSION, EMPTY } from "../../../../../common/crossword-constants";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";

@Injectable()
export class IdService {

    private _currentOrder: number;
    private _elements: ElementRef[];
    public constructor() {
        this._currentOrder = 1;
        this._elements = [];
    }

    public focusLetter(way: number, word: WordInterface): void {
        const idToFocus: string = this.obtainNextId(way, word);
        this.obtainElement(idToFocus).nativeElement.focus();
    }

    public obtainElement(id: string): ElementRef {
        for (const element of this._elements) {
            if (element.nativeElement.id === id) {
                return element;
            }
        }

        return null;
    }

    public isOrderLimit(word: WordInterface): boolean {
        const isStart: boolean = this._currentOrder === 1;
        const isEnd: boolean = this._currentOrder === this.obtainCurrentLength(word);

        return (isStart || isEnd);
    }

    public blur(word: WordInterface): void {
        for (const letter of word._letters) {
            this.obtainElement(this.obtainLetterId(letter)).nativeElement.blur();
        }
    }

    public setUppercaseById(letter: LetterInterface): void {
        const idToChange: string = this.obtainLetterId(letter);
        this.obtainElement(idToChange).nativeElement.value = letter._character.toUpperCase();
    }

    public obtainLimitIds(word: WordInterface): string[] {
        const ids: string[] = [];
        ids.push(this.obtainLetterId(word._letters[0]));
        ids.push(this.obtainLetterId(word._letters[this.obtainCurrentLength(word) - 1]));

        return ids;
    }

    public isOrderMax(word: WordInterface): boolean {
        return this._currentOrder < this.obtainCurrentLength(word);
    }

    private obtainNextId(position: number, currentWord: WordInterface): string {
        const firstDigit: number = currentWord._letters[this._currentOrder + position]._col;
        const secondDigit: number = currentWord._letters[this._currentOrder + position]._row * DIMENSION;

        return (secondDigit + firstDigit).toString();
    }

    private obtainLetterId(letter: LetterInterface): string {
        const firstDigit: number = letter._col;
        const secondDigit: number = letter._row * DIMENSION;

        return (secondDigit + firstDigit).toString();
    }

    public isSameId(word: WordInterface, currentWord: WordInterface): boolean {
        const currentWordIds: string[] = this.obtainLimitIds(currentWord);
        const otherWordIds: string[] = this.obtainLimitIds(word);
        const isSameStart: boolean = currentWordIds[0] === otherWordIds[0];
        const isSameEnd: boolean = currentWordIds[1] === otherWordIds[1];
        const isSameStartEnd: boolean = currentWordIds[0] === otherWordIds[1];
        const isSameEndStart: boolean = currentWordIds[1] === otherWordIds[0];

        return (isSameStart || isSameEnd || isSameStartEnd || isSameEndStart);
    }

    private isSameFirstId(word: WordInterface, foundWords: [WordInterface, string][]): boolean {
        if (foundWords === undefined) {
            return false;
        }
        for (const wordPlayer of foundWords) {
            const firstIdFoundWord: string = this.obtainLetterId(wordPlayer[0]._letters[0]);
            const firstIdOtherWord: string = this.obtainLetterId(word._letters[0]);
            const isFirst: boolean = firstIdFoundWord === firstIdOtherWord;
            const lastLetter: LetterInterface = wordPlayer[0]._letters[this.obtainCurrentLength(wordPlayer[0]) - 1];
            const lastIdFoundWord: string = this.obtainLetterId(lastLetter);
            const isLast: boolean = firstIdOtherWord === lastIdFoundWord;
            if (isFirst || isLast) {
                return true;
            }
        }

        return false;
    }

    public selectFirstId(word: WordInterface, foundWords: [WordInterface, string][]): string {
        let skip: number = 0;
        if (this.isSameFirstId(word, foundWords)) {
            skip = 1;
        }
        this._currentOrder = skip + 1;
        const firstDigit: number = word._letters[skip]._col;
        const secondDigit: number = word._letters[skip]._row * DIMENSION;

        return (secondDigit + firstDigit).toString();
    }

    public obtainCurrentLength(word: WordInterface): number {
        let length: number = 0;
        for (const l of word._letters) {
            if (l === undefined) {
                continue;
            }
            length++;
        }

        return length;
    }

    public obtainLetter(letter: LetterInterface): string {
        return this.obtainElement(this.obtainLetterId(letter)).nativeElement.value;
    }

    public obtainLength(letter: LetterInterface): number {
        return this.obtainElement(this.obtainLetterId(letter)).nativeElement.value.length;
    }

    public toString(word: WordInterface): string {
        let wordAsString: string = EMPTY;
        for (const letter of word._letters) {
            wordAsString += letter._character;
        }

        return wordAsString;
    }

    public get currentOrder(): number {
        return this._currentOrder;
    }
    public set currentOrder(order: number) {
        this._currentOrder = order;
    }
    public get elements(): ElementRef[] {
        return this._elements;
    }
    public set elements(elements: ElementRef[]) {
        this._elements = elements;
    }
}
