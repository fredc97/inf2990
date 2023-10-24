import { Component, OnInit, Input, AfterViewInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { CrosswordService } from "./crossword.service";
import { EMPTY } from "../../../../../common/crossword-constants";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";
const INDEX: string = "index";
const CASE: string = "case";
const TAB: string = "Tab";
@Component({
    selector: "app-grid",
    templateUrl: "./grid.component.html",
    styleUrls: ["./grid.component.css"]
})

export class GridComponent implements OnInit, AfterViewInit {
    @Input() private players: string[];
    @Input() private currentPlayer: string;
    @ViewChildren("element") private _elements: QueryList<ElementRef>;

    private _isCheatMode: boolean;
    private _currentId: string;

    public constructor(private _crosswordService: CrosswordService) {

        this._isCheatMode = false;
        this._currentId = EMPTY;
    }

    public ngAfterViewInit(): void {
        this.fillElements();
        this.resetElements();
    }

    public ngOnInit(): void {
        if (this.players !== undefined) {
            this._crosswordService.players = this.players;
        }
        if (this.currentPlayer !== undefined) {
            this._crosswordService.currentPlayer = this.currentPlayer;
        }
    }

    public showCurrentWord(word: WordInterface): string {
        if (word === undefined) {
            return EMPTY;
        }

        for (const wordToFind of this._crosswordService.grid._words) {
            if (JSON.stringify(wordToFind) === JSON.stringify(word)) {
                return wordToFind._definition;
            }
        }

        return EMPTY;
    }

    public fillElements(): void {
        this._crosswordService.searchService.idService.elements = [];
        this._elements.toArray().forEach((element: ElementRef) => {
            this._crosswordService.searchService.idService.elements.push(element);
        });
    }

    public resetElements(): void {
        this._elements.changes.subscribe(() => {
            if (this._crosswordService.isResetting) {
                this._crosswordService.isResetting = false;
                this._isCheatMode = false;
                this.fillElements();
            }
        });
    }

    public setIndexCase(letter: LetterInterface): string {
        for (const word of this._crosswordService.grid._words) {
            if (JSON.stringify(word._letters[0]) === JSON.stringify(letter)) {
                return word._index.toString();
            }
        }

        return EMPTY;
    }

    public focusToIndex(word: WordInterface): void {

        this._crosswordService.searchService.idService.obtainElement(this.obtainFirstId(word)).nativeElement.focus();
        this._crosswordService.socket.emitOtherWord(this._crosswordService.searchService.idService.toString(word));
        this._crosswordService.searchService.currentWord = word;
    }

    public changeMode(): void {
        this._isCheatMode = !this._isCheatMode;
    }

    public changeWord(word: WordInterface): string {
        if (this._isCheatMode) {
            return this._crosswordService.searchService.idService.toString(word);
        } else {
            return word._definition;
        }
    }

    public focusFirstLetter(letter: LetterInterface): void {
        this._crosswordService.searchService.idService.currentOrder = 1;
        const wordsChoices: WordInterface[] = [];
        this._crosswordService.obtainSameLetterWords(wordsChoices, letter);
        let firstId: string = this.obtainFirstId(wordsChoices[0]);
        if ((this._currentId === firstId) && (wordsChoices.length > 1)) {
            firstId = this.selectId(wordsChoices);
        } else {
            this._crosswordService.socket.emitOtherWord(this._crosswordService.searchService.idService.toString(wordsChoices[0]));
            this._crosswordService.searchService.currentWord = wordsChoices[0];
        }
        this._crosswordService.searchService.idService.obtainElement(firstId).nativeElement.focus();
        this._currentId = firstId.toString();
    }

    public isWordFound(word: WordInterface): boolean {
        for (const wordPlayer of this._crosswordService.searchService.foundWords) {
            if (wordPlayer[0] === word) {
                return true;
            }
        }

        return false;
    }

    public removeTab(event: KeyboardEvent): void {
        if (event.key === TAB) {
            event.preventDefault();
        }
    }

    public removeFocus(event: MouseEvent): void {
        const target: Element = event.target as Element;
        const isSelectedCase: boolean = target.className === CASE;
        const isSelectedIndex: boolean = target.className === INDEX;

        if (!(isSelectedCase || isSelectedIndex)) {
            this._crosswordService.socket.emitOtherWord(EMPTY);
            this._crosswordService.searchService.currentWord = undefined;
        }
    }

    private selectId(wordsChoices: WordInterface[]): string {
        let firstId: string;
        if (this._crosswordService.searchService.currentWord === wordsChoices[0]) {
            firstId = this.obtainFirstId(wordsChoices[1]);
            this._crosswordService.socket.emitOtherWord(this._crosswordService.searchService.idService.toString(wordsChoices[1]));
            this._crosswordService.searchService.currentWord = wordsChoices[1];
        } else {
            firstId = this.obtainFirstId(wordsChoices[0]);
            this._crosswordService.socket.emitOtherWord(this._crosswordService.searchService.idService.toString(wordsChoices[0]));
            this._crosswordService.searchService.currentWord = wordsChoices[0];
        }

        return firstId;
    }

    private obtainFirstId(word: WordInterface): string {
        return this._crosswordService.searchService.idService.selectFirstId(word, this._crosswordService.searchService.foundWords);
    }

}
