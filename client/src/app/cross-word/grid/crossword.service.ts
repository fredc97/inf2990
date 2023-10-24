import { Injectable } from "@angular/core";
import { SearchService } from "./search.service";
import { SocketClientService } from "./socketClient.service";
import { GridService } from "./grid.service";
import { PLAYER_ONE, PLAYER_TWO } from "../../constants/crossword-frontend-constants";
import {
    EMPTY, UPDATE_SECOND_PLAYER, REMATCH, REMATCH_RESPONSE, REFRESH_ON_WORD_FOUND, SET_OTHER_WORD
} from "../../../../../common/crossword-constants";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";
const NEXT: number = 0;
const BEFORE: number = -1;
const BACKSPACE: string = "Backspace";
@Injectable()
export class CrosswordService {
    private _players: string[];
    private _currentPlayer: string;
    private _grid: GridInterface;
    private _isResetting: boolean;
    public constructor(private _socketClientService: SocketClientService, private _searchService: SearchService,
                       private _gridService?: GridService) {
        this.initializeSocket();
        this._grid = undefined;
        this._players = [];
        this._currentPlayer = EMPTY;
        this._isResetting = false;
    }

    private initializeSocket(): void {
        this.refreshOnWordFound();
        this.setOtherWord();
        this.playAgainTwoPlayers();
        this.updateGrid();
    }

    private updateGrid(): void {
        this._socketClientService.socketClient.on(UPDATE_SECOND_PLAYER, (grid: GridInterface) => {
            this._grid = grid;
            this._isResetting = true;
            this._searchService.resetEnvironnement();
            this._searchService.popUp._isCreatingGrid = false;
            this._searchService.popUp._isWaitingPlayer = false;
        });
    }

    public playAgainSolo(): void {
        this._searchService.popUp._isCreatingGrid = true;
        this._searchService.resetEnvironnement();
        this._gridService.get(this._grid._difficulty).then((grid: GridInterface) => {
            this._grid = grid;
            this._searchService.popUp._isCreatingGrid = false;
            this._isResetting = true;
        }).catch((error) => console.error(error));
    }

    public playAgainTwoPlayers(): void {
        this._socketClientService.socketClient.on(REMATCH, () => {
            this._searchService.popUp._isWaitingPlayer = false;
            this._gridService.get(this._grid._difficulty).then((grid: GridInterface) => {
                this._grid = grid;
                this._isResetting = true;
                this._socketClientService.emitGridAfterRematch(grid);
                this._searchService.resetEnvironnement();
                this._searchService.popUp._isCreatingGrid = false;
                this._searchService.popUp._isWaitingPlayer = false;
            }).catch((error) => console.error(error));
        });
    }

    public rematch(): void {
        this._searchService.popUp._isWaitingPlayer = true;
        this._searchService.popUp._isCreatingGrid = true;
        this._socketClientService.socketClient.emit(REMATCH_RESPONSE);
    }

    public countWordsForPlayers(): [number, number] {
        this._searchService.wordsCount = [0, 0];
        for (const wordPlayer of this._searchService.foundWords) {
            if (wordPlayer[1] === this._players[PLAYER_ONE]) {
                this._searchService.wordsCount[PLAYER_ONE]++;
            } else {
                this._searchService.wordsCount[PLAYER_TWO]++;
            }
        }

        return this._searchService.wordsCount;
    }

    private refreshOnWordFound(): void {
        this._socketClientService.socketClient.on(REFRESH_ON_WORD_FOUND, (wordToFind: string) => {
            for (const word of this._grid._words) {
                if (this._searchService.idService.toString(word) === wordToFind) {
                    this._socketClientService.emitOtherWord(this._searchService.idService.toString(word));
                    this._searchService.currentWord = word;
                    for (const letter of this._searchService.currentWord._letters) {
                        this._searchService.idService.setUppercaseById(letter);
                    }
                }
            }
            let thePlayer: string = EMPTY;
            if (this._players[PLAYER_ONE] !== this._currentPlayer) {
                thePlayer = this._players[PLAYER_ONE];
            } else if (this._players[PLAYER_TWO] !== this._currentPlayer) {
                thePlayer = this._players[PLAYER_TWO];
            }
            this.addToFoundWords(thePlayer);
        });
    }

    private setOtherWord(): void {
        this._socketClientService.socketClient.on(SET_OTHER_WORD, (wordToFind: string) => {
            this._searchService.otherWord = wordToFind;
            if (wordToFind === EMPTY) {
                this._searchService.otherWordComplete = undefined;
            } else {
                for (const word of this._grid._words) {
                    if (this._searchService.idService.toString(word) === wordToFind) {
                        this._searchService.otherWordComplete = word;
                        break;
                    }
                }
            }
        });
    }

    public setLetterRestriction(event: number): boolean {
        const restriction: RegExp = /[a-zA-Z]+/;
        const inputLetter: string = String.fromCharCode(event);
        const isNumber: boolean = restriction.test(inputLetter);
        if (!isNumber && this._searchService.idService.currentOrder === 0) {
            this.deleteLetter();
        }

        return isNumber;
    }

    public selectKeyUpOption(event: KeyboardEvent, max: number, current: number): void {
        if (event.key === BACKSPACE) {
            this.deleteLetter();
        } else {
            if (this._searchService.idService.isOrderLimit(this._searchService.currentWord)) {
                this.addIndirectMatch();
            }
            if (this._searchService.isFull(this._searchService.currentWord)) {
                if (this._searchService.isMatch(this._searchService.currentWord)) {
                    this._socketClientService.emitWordFound(this._searchService.idService.toString(this._searchService.currentWord));
                    this.addToFoundWords(this._currentPlayer);

                    return;
                }
            }
            this.focusNextLetter(max, current);
        }
    }

    private addToFoundWords(player: string): void {
        this._searchService.foundWords.push([this._searchService.currentWord, player]);
        this.countWordsForPlayers();
        this._searchService.idService.blur(this._searchService.currentWord);
        this._socketClientService.emitOtherWord(EMPTY);
        this._searchService.currentWord = undefined;
        this._searchService.otherWordComplete = undefined;
    }

    private addIndirectMatch(): void {
        for (const word of this._grid._words) {
            if (this._searchService.currentWord === word) {
                continue;
            }
            if (this._searchService.idService.isSameId(word, this._searchService.currentWord)) {
                if (this._searchService.isFull(word)) {
                    if (this._searchService.isMatch(word)) {
                        if (this._searchService.isDoppelganger(this._searchService.idService.toString(word))) {
                            return;
                        }
                        this._searchService.foundWords.push([word, this._currentPlayer]);
                        this._socketClientService.emitWordFound(this._searchService.idService.toString(word));

                        return;
                    }
                }
            }
        }
    }

    private deleteLetter(): void {
        this._searchService.setLetterToBackTrack();
        this._searchService.idService.focusLetter(BEFORE, this._searchService.currentWord);
    }

    private focusNextLetter(max: number, current: number): void {
        if (max === current && this._searchService.idService.isOrderMax(this._searchService.currentWord)) {
            this._searchService.idService.focusLetter(NEXT, this._searchService.currentWord);
            ++this._searchService.idService.currentOrder;
            const lastLetter: LetterInterface = this._searchService.currentWord._letters[this._searchService.idService.currentOrder - 1];
            if (this._searchService.isLetterFound(lastLetter)) {
                --this._searchService.idService.currentOrder;
            }
        }
    }

    public obtainSameLetterWords(wordsChoices: WordInterface[], letterToFind: LetterInterface): void {
        for (const word of this._grid._words) {
            for (const letter of word._letters) {
                if (this._searchService.isSameLetter(letter, letterToFind)) {
                    wordsChoices.push(word);
                    break;
                }
                if (wordsChoices.length > 1) {
                    return;
                }
            }
        }
    }

    public get searchService(): SearchService {
        return this._searchService;
    }
    public get currentPlayer(): string {
        return this._currentPlayer;
    }
    public set currentPlayer(currentPlayer: string) {
        this._currentPlayer = currentPlayer;
    }
    public get players(): string[] {
        return this._players;
    }
    public set players(players: string[]) {
        this._players = players;
    }
    public get grid(): GridInterface {
        return this._grid;
    }
    public set grid(grid: GridInterface) {
        this._grid = grid;
    }
    public get socket(): SocketClientService {
        return this._socketClientService;
    }
    public get isResetting(): boolean {
        return this._isResetting;
    }
    public set isResetting(isResetting: boolean) {
        this._isResetting = isResetting;
    }
}
