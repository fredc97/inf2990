import { CrosswordService } from "./crossword.service";
import { SocketClientService } from "./socketClient.service";
import { TestBed, inject, async, fakeAsync, tick } from "@angular/core/testing";
import { SearchService } from "./search.service";
import { IdService } from "./id.service";
import { GridService } from "./grid.service";
import { Http, ConnectionBackend, RequestOptions, BaseRequestOptions, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { ReflectiveInjector } from "@angular/core";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";
/* tslint:disable: no-magic-numbers */
const GRID_TEST: GridInterface = {
    _words: [],
    _letters: [],
    _difficulty: 1
};
describe("CrossWordService", () => {
    let crossWordService: CrosswordService;
    let searchService: SearchService;
    const injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions },
        Http, GridService,
      ]);
    const gridService: GridService = injector.get(GridService);
    const backend: MockBackend = injector.get(ConnectionBackend) as MockBackend;
    let lastConnection: MockConnection;
    backend.connections.subscribe((connection: MockConnection) => lastConnection = connection);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [CrosswordService, SocketClientService, IdService, SearchService, GridService]
        }).compileComponents().catch((err) => {
            console.error(err);
          });
    }));
    it("id/search service should be created", inject([IdService], (service: IdService) => {
        searchService = new SearchService(service);
        expect(service).toBeTruthy();
    }));
    it("socket should be created", inject([SocketClientService], (socket: SocketClientService) => {
        crossWordService = new CrosswordService(socket, searchService, gridService);
        expect(socket).toBeTruthy();
    }));

    describe("Constuctor of the CrossWordService", () => {
        it("should be instantiate the CrossWordService correctly", () => {
            expect(crossWordService).toBeDefined();
        });
        it("should have an order of '1'", () => {
            expect(crossWordService.searchService.idService.currentOrder).toBe(1);
        });
    });

    describe("Only allow adding a letter as input", () => {
        it("should refuse entries with the number '1'", () => {
            const aKeyCodeNumber: number = 49;
            expect(crossWordService.setLetterRestriction(aKeyCodeNumber)).toBe(false);
        });
        it("should refuse entries with the number '8'", () => {
            const aKeyCodeNumber: number = 56;
            expect(crossWordService.setLetterRestriction(aKeyCodeNumber)).toBe(false);
        });
        it("should accepte entries with the letter A", () => {
            const aKeyCodeLetter: number = 65;
            expect(crossWordService.setLetterRestriction(aKeyCodeLetter)).toBe(true);

        });
        it("should accepte entries with the letter F", () => {
            const aKeyCodeLetter: number = 70;
            expect(crossWordService.setLetterRestriction(aKeyCodeLetter)).toBe(true);
        });
    });
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

    const word2: WordInterface = {
        _index: 1,
        _isHorizontal: true,
        _letters: [letter3, letter5, letter6],
        _order: 1,
        _definition: "motha",
    };
    describe("countWords", () => {
        it("should count the number of words founds", () => {
            crossWordService.players = players;
            expect(crossWordService.searchService.foundWords.length).toBe(0);
            crossWordService.searchService.foundWords.push([word, crossWordService.players[0]]);
            crossWordService.searchService.foundWords.push([word, crossWordService.players[1]]);
            expect(crossWordService.searchService.foundWords.length).toBe(2);
        });
        it("should count the number of words founds by each player", () => {
            crossWordService.searchService.foundWords.push([word, crossWordService.players[0]]);
            crossWordService.countWordsForPlayers();
            expect(crossWordService.searchService.wordsCount[0]).toBe(2);
            expect(crossWordService.searchService.wordsCount[1]).toBe(1);
        });
    });
    describe("should find out which word is selected and by who", () => {
        it("first, the letters should be part of the current word", () => {
            crossWordService.searchService.currentWord = word;
            expect(crossWordService.searchService.isPartOfCurrentWord(word._letters[0])).toBe(true);
            expect(crossWordService.searchService.isPartOfCurrentWord(word._letters[1])).toBe(true);
            expect(crossWordService.searchService.isPartOfCurrentWord(word._letters[2])).toBe(true);
        });
        it("next, there should be two players", () => {
            crossWordService.players = players;
            expect(crossWordService.players.length).toBe(2);
        });
        it("next, we should find out if the current word is selected by the current player", () => {
            expect(crossWordService.searchService.isRightUser(crossWordService.currentPlayer, crossWordService.players)).toBe(true);
        });
        it("first, the letters should be part of the other word", () => {
            crossWordService.searchService.otherWordComplete = word2;
            expect(crossWordService.searchService.isPartOfOtherWord(word2._letters[0])).toBe(true);
            expect(crossWordService.searchService.isPartOfOtherWord(word2._letters[1])).toBe(true);
            expect(crossWordService.searchService.isPartOfOtherWord(word2._letters[2])).toBe(true);
        });
        it("next, there should be two players", () => {
            crossWordService.players = players;
            expect(crossWordService.players.length).toBe(2);
        });
        it("next, we should find out if the other word is selected by the other player", () => {
            expect(crossWordService.searchService.isRightUser(crossWordService.currentPlayer, crossWordService.players)).toBe(true);
        });
    });
    describe("the clients should see who found which word", () => {
        it("should find out if the word is found", () => {
            crossWordService.searchService.foundWords.pop();
            crossWordService.searchService.foundWords.pop();
            crossWordService.searchService.foundWords.pop();
            crossWordService.searchService.foundWords.push([word, crossWordService.players[0]]);
            crossWordService.searchService.foundWords.push([word2, crossWordService.players[1]]);
            expect(crossWordService.searchService.foundWords[0][0]).toBe(word);
            expect(crossWordService.searchService.foundWords[1][0]).toBe(word2);
        });
        it("it should find if its the main player or not (the color will change if its true or false)", () => {
            expect(crossWordService.searchService.isWordFoundByPlayer(word, players)).toBe(true);
            expect(crossWordService.searchService.isWordFoundByPlayer(word2, players)).toBe(false);
        });
    });
    describe("End of the game", () => {
        it("it should end (when it have 20 words)", () => {
            crossWordService.searchService.foundWords.pop();
            crossWordService.searchService.foundWords.pop();
            for (let i: number = 0; i < 20; i++) {
                crossWordService.searchService.foundWords.push([word, crossWordService.players[0]]);
            }
            expect(crossWordService.searchService.foundWords.length).toBe(20);
        });
        describe("Solo", () => {
            it("it should show the winning pop up", () => {
                crossWordService.players.pop();
                crossWordService.players.pop();
                const isGameOver: boolean = crossWordService.searchService.isGameOver();
                const playersLength: boolean = crossWordService.players.length === 0;
                expect(isGameOver && playersLength).toBe(true);
            });
            it("if the player want to play again, it should reinitialize the grid and generate another", fakeAsync(() => {
                let result: GridInterface = {
                    _words : [],
                    _letters : [],
                    _difficulty: 1
                };
                GRID_TEST._words.push(word2);
                result._words.push(word);
                crossWordService.grid = result;
                gridService.get(1).then((grid: GridInterface) => {
                    result = grid;
                    crossWordService.playAgainSolo();
                }).catch((error) => console.error(error));
                lastConnection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(GRID_TEST),
                })));
                tick();
                expect(result._difficulty).toBe(1);
                expect(result._difficulty === crossWordService.grid._difficulty).toBe(true);
                expect(result._words[0] === crossWordService.grid._words[0]).toBe(false);
            }));
        });
        describe("Two players", () => {
            it("it should show the winning pop up for the winner", () => {
                crossWordService.players.push("FRED");
                crossWordService.players.push("SON");
                crossWordService.searchService.foundWords = [];
                expect(crossWordService.players.length).toBe(2);
                for (let i: number = 0; i < 8; i++) {
                    crossWordService.searchService.foundWords.push([word, crossWordService.players[0]]);
                }
                crossWordService.searchService.wordsCount[0] = 8;
                for (let i: number = 0; i < 12; i++) {
                    crossWordService.searchService.foundWords.push([word, crossWordService.players[1]]);
                }
                crossWordService.searchService.wordsCount[1] = 12;

                const winner: string = crossWordService.searchService.findWinner(
                    crossWordService.players, crossWordService.searchService.wordsCount);
                const isWinnerCurrentPlayer: boolean = (winner === crossWordService.players[1]);
                const noEgality: boolean = crossWordService.searchService.wordsCount[0] !== crossWordService.searchService.wordsCount[1];
                const isGameOver: boolean = crossWordService.searchService.isGameOver();
                const playersLength: boolean = crossWordService.players.length === 2;

                const isAbleToSeeTheWinnerPopUp: boolean = (isGameOver && playersLength && isWinnerCurrentPlayer && noEgality );
                expect(isAbleToSeeTheWinnerPopUp);
            });
            it("it should show the game over pop up for the loser", () => {
                const winner: string = crossWordService.searchService.findWinner(
                    crossWordService.players, crossWordService.searchService.wordsCount);
                const isWinnerCurrentPlayer: boolean = (winner !== crossWordService.players[0]);
                const noEgality: boolean = crossWordService.searchService.wordsCount[0] !== crossWordService.searchService.wordsCount[1];
                const isGameOver: boolean = crossWordService.searchService.isGameOver();
                const playersLength: boolean = crossWordService.players.length === 2;
                const isAbleToSeeTheLoserPopUp: boolean = (isGameOver && playersLength && isWinnerCurrentPlayer && noEgality );
                expect(isAbleToSeeTheLoserPopUp);
            });
        });
    });
});
