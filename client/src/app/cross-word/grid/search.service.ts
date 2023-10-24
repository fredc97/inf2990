import { Injectable } from "@angular/core";
import { IdService } from "./id.service";
import { PLAYER_TWO, PLAYER_ONE } from "../../constants/crossword-frontend-constants";
import { EMPTY, MAX_WORDS } from "../../../../../common/crossword-constants";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";
import { PopUpInterface } from "../interfaces/pop-up-interface";
@Injectable()
export class SearchService {
    private _foundWords: Array<[WordInterface, string]>;
    private _currentWord: WordInterface;
    private _otherWordComplete: WordInterface;
    private _otherWord: string;
    private _wordsCount: [number, number];
    private _popUp: PopUpInterface;

    public constructor(private _idService: IdService) {
        this._foundWords = Array<[WordInterface, string]>();
        this._currentWord = undefined;
        this._otherWordComplete = undefined;
        this._otherWord = EMPTY;
        this._wordsCount = [0, 0];
        this._popUp = {
            _isCreatingGrid: false,
            _isWaitingPlayer: false
        };
    }

    public findWinner(players: string[], wordsCount: number[]): string {
        if (wordsCount[PLAYER_ONE] > wordsCount[PLAYER_TWO]) {
            return players[PLAYER_ONE];
        } else {
            return players[PLAYER_TWO];
        }
    }

    public setLetterToBackTrack(): void {
        --this._idService.currentOrder;
        if (this.isLetterFound(this._currentWord._letters[this._idService.currentOrder - 1])) {
            ++this._idService.currentOrder;
        }
        if (this._idService.currentOrder < 1) {
            this._idService.currentOrder = 1;
        }
    }

    public isGameOver(): boolean {
        if (this._foundWords.length >= MAX_WORDS) {
            return true;
        }

        return false;
    }

    public isWordFoundByPlayer(word: WordInterface, players: string[]): boolean {
        if (players === undefined) {

            return false;
        }
        for (const wordPlayer of this._foundWords) {
            if (wordPlayer[0] === word) {
                if (wordPlayer[1] === players[PLAYER_ONE]) {

                    return true;
                }

                return false;
            }
        }

        return false;
    }

    public isLetterFoundByPlayer(letterToFind: LetterInterface, players: string[]): boolean {
        if (players === undefined) {
            return false;
        }
        for (const wordPlayer of this._foundWords) {
            for (const letter of wordPlayer[0]._letters) {
                if (JSON.stringify(letter) === JSON.stringify(letterToFind)) {
                    if (wordPlayer[1] === players[PLAYER_ONE]) {
                        return true;
                    }

                    return false;
                }
            }
        }

        return false;
    }

    public isLetterFound(letterToFind: LetterInterface): boolean {
        for (const wordPlayer of this._foundWords) {
            if (this.isLetterPartOfWord(letterToFind, wordPlayer[0]._letters)) {
                return true;
            }
        }

        return false;
    }

    public isLetterBothFound(letterToFind: LetterInterface): boolean {
        for (const wordPlayer of this._foundWords) {
            if (this.isLetterPartOfWord(letterToFind, wordPlayer[0]._letters)) {
                return this.isLetterFromDifferentPlayer(wordPlayer, letterToFind);
            }
        }

        return false;
    }

    public isLetterFromDifferentPlayer(otherWordPlayer: [WordInterface, string], letterToFind: LetterInterface): boolean {
        for (const wordPlayer of this._foundWords) {
            if (wordPlayer === otherWordPlayer) {
                continue;
            }
            for (const letter of wordPlayer[0]._letters) {
                if (JSON.stringify(letterToFind) === JSON.stringify(letter) && wordPlayer[1] !== otherWordPlayer[1]) {
                    return true;
                }
            }
        }

        return false;
    }

    public isLetterBothSelected(letterToFind: LetterInterface): boolean {
        if (this._otherWordComplete === undefined || this._currentWord === undefined) {
            return false;
        }
        for (const letter of this._currentWord._letters) {
            if (this.isSameLetter(letter, letterToFind)) {
                for (const otherLetter of this._otherWordComplete._letters) {
                    if (this.isSameLetter(otherLetter, letter) && this.isSameLetter(otherLetter, letterToFind)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public isPartOfCurrentWord(letterToFind: LetterInterface): boolean {
        if (this._currentWord === undefined) {
            return false;
        }
        if (this.isLetterPartOfWord(letterToFind, this._currentWord._letters)) {
            return true;
        }

        return false;
    }

    public isPartOfOtherWord(letterToFind: LetterInterface): boolean {
        if (this._otherWordComplete === undefined) {
            return false;
        }
        if (this.isLetterPartOfWord(letterToFind, this._otherWordComplete._letters)) {
            return true;
        }

        return false;
    }

    public isWordSelected(word: WordInterface): boolean {
        if (this._currentWord === undefined) {
            return false;
        }
        if (word === this._currentWord) {
            return true;
        }

        return false;
    }

    private isLetterPartOfWord(letterToFind: LetterInterface, letters: LetterInterface[]): boolean {
        for (const letter of letters) {
            if (this.isSameLetter(letter, letterToFind)) {
                return true;
            }
        }

        return false;
    }

    public isMatch(word: WordInterface): boolean {
        if (word === undefined) {
            return false;
        }
        let isMatch: boolean = false;
        for (const letter of word._letters) {
            if (letter._character.toUpperCase() === this._idService.obtainLetter(letter)) {
                isMatch = true;
            } else {
                return false;
            }
        }

        return isMatch;
    }

    public isRightUser(currentPlayer: string, players: string[]): boolean {
        if (currentPlayer === players[0]) {
            return true;
        } else if (currentPlayer === players[1]) {
            return false;
        }

        return true;
    }

    public isFull(word: WordInterface): boolean {
        let isFull: boolean = false;
        for (const letter of word._letters) {
            if (letter._character.length === this._idService.obtainLength(letter)) {
                isFull = true;
            } else {
                return false;
            }
        }

        return isFull;
    }

    public isDoppelganger(word: string): boolean {
        for (const wordPlayer of this._foundWords) {
            if (this._idService.toString(wordPlayer[0]) === word) {
                return true;
            }
        }

        return false;
    }

    public resetEnvironnement(): void {
        for (const element of this._idService.elements) {
            element.nativeElement.value = EMPTY;
        }
        this._foundWords = [];
        this._idService.currentOrder = 1;
        this._currentWord = undefined;
        this._otherWord = undefined;
        this._wordsCount = [0, 0];
    }

    public isSameLetter(firstLetter: LetterInterface, secondLetter: LetterInterface): boolean {
        return JSON.stringify(firstLetter) === JSON.stringify(secondLetter);
    }

    public get foundWords(): Array<[WordInterface, string]> {
        return this._foundWords;
    }
    public set foundWords(foundWords: Array<[WordInterface, string]>) {
        this._foundWords = foundWords;
    }
    public get currentWord(): WordInterface {
        return this._currentWord;
    }
    public set currentWord(currentWord: WordInterface) {
        this._currentWord = currentWord;
    }
    public get otherWord(): string {
        return this._otherWord;
    }
    public set otherWord(otherWord: string) {
        this._otherWord = otherWord;
    }
    public get otherWordComplete(): WordInterface {
        return this._otherWordComplete;
    }
    public set otherWordComplete(otherWordComplete: WordInterface) {
        this._otherWordComplete = otherWordComplete;
    }
    public get idService(): IdService {
        return this._idService;
    }
    public get wordsCount(): [number, number] {
        return this._wordsCount;
    }
    public set wordsCount(wordsCount: [number, number]) {
        this._wordsCount = wordsCount;
    }
    public get popUp(): PopUpInterface {
        return this._popUp;
    }
}
