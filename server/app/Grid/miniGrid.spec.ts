import { GridService } from "./grid.service";
import { Word } from "./word";
import { ORIGIN_MINI_GRID_THREE, ORIGIN_MINI_GRID_FOUR, EASY, NORMAL, HARD } from "./crossword-backend-constants";
import * as chai from "chai";
// tslint:disable:no-magic-numbers
const ORIGIN_MINI_GRID_ONE: number[] = [0, 0];
const ORIGIN_MINI_GRID_TWO: number[] = [0, 5];
describe("MiniGrid", () => {
    const grid: GridService = new GridService();
    grid.initializeLetters();
    grid.createMiniGrids();
    grid.difficulty = EASY;
    const testString: string = "apple";
    const testWord: Word = grid.miniGrids[0].createWord([0, 4], 0);
    testWord.addLetters(testString, 1);
    grid.miniGrids[0].wordManipulator.words.push(testWord);
    describe("Size", () => {
        it("should have 25 empty letters", () => {
            let rows: number = 0;
            let cols: number = 0;
            let letters: number = 0;
            for (let col: number = 0; col < 5; col++) {
                for (let row: number = 0; row < 5; row++) {
                    if (grid.miniGrids[0].letters[row][col].row === 0) {
                        rows++;
                    }
                    if (grid.miniGrids[0].letters[row][col].col === 0) {
                        cols++;
                    }
                    letters++;
                }
            }
            chai.expect(rows).to.equal(5);
            chai.expect(cols).to.equal(5);
            chai.expect(letters).to.equal(25);
        });
    });

    describe("SearchDoppelGanger", () => {
        it("should find a doppelGanger", () => {
            grid.miniGrids[0].allWords.push(testWord);
            grid.miniGrids[0].allWords.push(testWord);
            chai.expect(grid.miniGrids[0].searchDoppelganger("apple")).to.equal(true);
        });

    });

    describe("CreateWord", () => {
        it("should create an empty word", () => {
            const aWord: Word = grid.miniGrids[0].createWord([0, 4], 0);
            grid.miniGrids[0].words.push(aWord);
            chai.expect(grid.miniGrids[0].words.length).to.equal(2);
        });
    });

    describe("MiniGrids origin points", () => {
        it("should have the right origin points", () => {
            chai.expect(grid.letters[0][0].row).to.equal(ORIGIN_MINI_GRID_ONE[0]);
            chai.expect(grid.letters[0][0].col).to.equal(ORIGIN_MINI_GRID_ONE[1]);

            chai.expect(grid.letters[0][5].row).to.equal(ORIGIN_MINI_GRID_TWO[0]);
            chai.expect(grid.letters[0][5].col).to.equal(ORIGIN_MINI_GRID_TWO[1]);

            chai.expect(grid.letters[5][0].row).to.equal(ORIGIN_MINI_GRID_THREE[0]);
            chai.expect(grid.letters[5][0].col).to.equal(ORIGIN_MINI_GRID_THREE[1]);

            chai.expect(grid.letters[5][5].row).to.equal(ORIGIN_MINI_GRID_FOUR[0]);
            chai.expect(grid.letters[5][5].col).to.equal(ORIGIN_MINI_GRID_FOUR[1]);
        });
    });
    describe("Selecting the definition", () => {

        const definitionsOne: string[] = ["1"];
        const definitionsTwo: string[] = ["1", "2"];
        const definitionsMultiple: string[] = ["1", "2", "3", "4", "5"];
        it("should have the first definition for easy (only the first one)", () => {
            const gridEasy: GridService = new GridService();
            gridEasy.initializeLetters();
            gridEasy.difficulty = EASY;
            gridEasy.createMiniGrids();

            chai.expect(gridEasy.miniGrids[0].selectDefinition(definitionsOne.toString())).to.equal("1");
            chai.expect(gridEasy.miniGrids[0].selectDefinition(definitionsTwo.toString())).to.equal("1");
            chai.expect(gridEasy.miniGrids[0].selectDefinition(definitionsMultiple.toString())).to.equal("1");
        });
        it("should have the any definition except the first for normal and hard (except 1 definition array)", () => {
            const gridNormal: GridService = new GridService();
            gridNormal.initializeLetters();
            gridNormal.difficulty = NORMAL;
            gridNormal.createMiniGrids();

            chai.expect(gridNormal.miniGrids[0].selectDefinition(definitionsOne.toString())).to.equal("1");
            chai.expect(gridNormal.miniGrids[0].selectDefinition(definitionsTwo.toString())).to.not.equal("1");
            chai.expect(gridNormal.miniGrids[0].selectDefinition(definitionsMultiple.toString())).to.not.equal("1");
            const gridHard: GridService = new GridService();
            gridHard.initializeLetters();
            gridHard.difficulty = HARD;
            gridHard.createMiniGrids();

            chai.expect(gridHard.miniGrids[0].selectDefinition(definitionsOne.toString())).to.equal("1");
            chai.expect(gridHard.miniGrids[0].selectDefinition(definitionsTwo.toString())).to.not.equal("1");
            chai.expect(gridHard.miniGrids[0].selectDefinition(definitionsMultiple.toString())).to.not.equal("1");
        });
    });
});
