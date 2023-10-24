import { TestBed, inject } from "@angular/core/testing";
import { SearchService } from "./search.service";
import { IdService } from "./id.service";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";

// tslint:disable:no-magic-numbers
describe("SearchService", () => {
    let searchService: SearchService;
    const players: string[] = ["Son-Thang Pham", "Frederic Carpentier"];
    const letter1: LetterInterface = {
        _character: "m",
        _row: 0,
        _col: 0,
        _order: 1,
        _isBlank: false,
    };
    const letter2: LetterInterface = {
        _character: "o",
        _row: 0,
        _col: 1,
        _order: 1,
        _isBlank: false,
    };
    const letter3: LetterInterface = {
        _character: "m",
        _row: 0,
        _col: 2,
        _order: 1,
        _isBlank: false,
    };
    const word: WordInterface = {
        _index: 1,
        _isHorizontal: true,
        _letters: [letter1, letter2, letter3],
        _order: 1,
        _definition: "mother",
    };
    const letter5: LetterInterface = {
        _character: "u",
        _row: 1,
        _col: 2,
        _order: 1,
        _isBlank: false,
    };
    const letter6: LetterInterface = {
        _character: "m",
        _row: 2,
        _col: 2,
        _order: 1,
        _isBlank: false,
    };
    const letterX: LetterInterface = {
        _character: "x",
        _row: 8,
        _col: 5,
        _order: 1,
        _isBlank: false,
    };
    const word2: WordInterface = {
        _index: 1,
        _isHorizontal: true,
        _letters: [letter3, letter5, letter6],
        _order: 1,
        _definition: "mother",
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SearchService, IdService]
        });
    });

    it("search service should be created", inject([SearchService], (service: SearchService) => {
        expect(service).toBeTruthy();
    }));
    it("id service should be created", inject([IdService], (service: IdService) => {
        searchService = new SearchService(service);
        expect(service).toBeTruthy();
    }));
    it("should find the winner", () => {
        const wordsCount: number[] = [15, 0];
        const wordsCountOtherPlayer: number[] = [0, 8];
        expect(searchService.findWinner(players, wordsCount)).toBe("Son-Thang Pham");
        expect(searchService.findWinner(players, wordsCountOtherPlayer)).toBe("Frederic Carpentier");
    });
    it("should find out if a word is found by a player (it will be visible by both)", () => {
        searchService.foundWords.push([word, players[0]]);
        expect(searchService.isWordFoundByPlayer(word2, players)).toBe(false);
        expect(searchService.isWordFoundByPlayer(word, players)).toBe(true);
    });
    it("should find out if a letter is found by a player (it will be visible by both)", () => {
        expect(searchService.isLetterFoundByPlayer(word._letters[0], players)).toBe(true);
        expect(searchService.isLetterFoundByPlayer(word._letters[1], players)).toBe(true);
        expect(searchService.isLetterFoundByPlayer(word._letters[2], players)).toBe(true);
        expect(searchService.isLetterFoundByPlayer(word2._letters[2], players)).toBe(false);
    });
    it("should find out if a letter shared by different player", () => {
        searchService.foundWords.push([word2, players[1]]);
        expect(searchService.isLetterFromDifferentPlayer(
            searchService.foundWords[0], searchService.foundWords[0][0]._letters[0])).toBe(false);
        expect(searchService.isLetterFromDifferentPlayer(
            searchService.foundWords[0], searchService.foundWords[0][0]._letters[2])).toBe(true);
    });
    it("should find out if a letter is both found", () => {
        expect(searchService.isLetterBothFound(searchService.foundWords[0][0]._letters[0])).toBe(false);
        expect(searchService.isLetterBothFound(searchService.foundWords[0][0]._letters[2])).toBe(true);
    });
    describe("a shared letter will have a dotted-style with two colors", () => {
        it("should find out if a letter is selected by two players", () => {
            expect(searchService.isLetterBothSelected(searchService.foundWords[0][0]._letters[0])).toBe(false);
            searchService.currentWord = searchService.foundWords[0][0];
            searchService.otherWordComplete = searchService.foundWords[1][0];
            expect(searchService.isLetterBothSelected(searchService.foundWords[0][0]._letters[2])).toBe(true);
            expect(searchService.isLetterBothSelected(searchService.foundWords[0][0]._letters[1])).toBe(false);
        });
    });
    describe("The current word will have a border width with a color (solo/vs)", () => {
        it("should find out the letter is part of the current word", () => {
            expect(searchService.isPartOfCurrentWord(searchService.foundWords[0][0]._letters[0])).toBe(true);
            expect(searchService.isPartOfCurrentWord(searchService.foundWords[0][0]._letters[1])).toBe(true);
            expect(searchService.isPartOfCurrentWord(searchService.foundWords[0][0]._letters[2])).toBe(true);
            expect(searchService.isPartOfCurrentWord(searchService.foundWords[1][0]._letters[2])).toBe(false);
        });
    });
    describe("The otherWord will have a border width with a different color than the current one (vs)", () => {
        it("should find out if the letter is part of the other word", () => {
            expect(searchService.isPartOfOtherWord(searchService.foundWords[1][0]._letters[0])).toBe(true);
            expect(searchService.isPartOfOtherWord(searchService.foundWords[1][0]._letters[1])).toBe(true);
            expect(searchService.isPartOfOtherWord(searchService.foundWords[1][0]._letters[2])).toBe(true);
            expect(searchService.isPartOfOtherWord(searchService.foundWords[0][0]._letters[2])).toBe(true);
            expect(searchService.isPartOfOtherWord(searchService.foundWords[0][0]._letters[1])).toBe(false);
        });
    });
    describe("finding in general", () => {
        it("should find out if the current word is selected", () => {
            expect(searchService.isWordSelected(searchService.foundWords[0][0])).toBe(true);
            expect(searchService.isWordSelected(searchService.foundWords[1][0])).toBe(false);
        });
        it("should find out if the letter is found", () => {
            expect(searchService.isLetterFound(letter1)).toBe(true);
            expect(searchService.isLetterFound(letter2)).toBe(true);
            expect(searchService.isLetterFound(letter3)).toBe(true);
            expect(searchService.isLetterFound(letter5)).toBe(true);
            expect(searchService.isLetterFound(letter6)).toBe(true);
            expect(searchService.isLetterFound(letterX)).toBe(false);
        });
        it("should find out if its a doppelganger", () => {
            expect(searchService.isDoppelganger("mom")).toBe(true);
        });
        it("should find out if its the right user", () => {
            expect(searchService.isRightUser(players[0], players)).toBe(true);
        });
        it("should find out if the game is over", () => {
            expect(searchService.isGameOver()).toBe(false);
            searchService.foundWords.pop();
            searchService.foundWords.pop();
            for (let i: number = 0; i < 20; i++) {
                searchService.foundWords.push([word, players[0]]);
            }
            expect(searchService.isGameOver()).toBe(true);
        });
    });
});
