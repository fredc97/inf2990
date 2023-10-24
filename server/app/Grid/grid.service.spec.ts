
import { GridService } from "./grid.service";
import { DIMENSION, MAX_WORDS } from "../../../common/crossword-constants";
import * as chai from "chai";
// tslint:disable:no-magic-numbers

describe("Grid", () => {
    const grid: GridService = new GridService();
    grid.initializeLetters();
    describe("initializeLetterIntoGrid", () => {
        it("Should have letters with the correct position in row", () => {
            chai.expect(grid.letters[9][9].row).to.equal(9);
            chai.expect(grid.letters[9][6].col).to.equal(6);
        });
        it("Should have 10 rows and 10 cols and 100 letters", () => {
            let rows: number = 0;
            let cols: number = 0;
            let letters: number = 0;
            for (let col: number = 0; col < DIMENSION; col++) {
                for (let row: number = 0; row < DIMENSION; row++) {
                    if (grid.letters[row][col].row === 0) {
                        rows++;
                    }
                    if (grid.letters[row][col].col === 2) {
                        cols++;
                    }
                    letters++;
                }
            }
            chai.expect(rows).to.equal(DIMENSION);
            chai.expect(cols).to.equal(DIMENSION);
            chai.expect(letters).to.equal(100);
        });
        it("Should have 100 letters with order of 0", () => {
            let order: number = 0;
            for (let col: number = 0; col < DIMENSION; col++) {
                for (let row: number = 0; row < DIMENSION; row++) {
                    if (grid.letters[row][col].order === 0) {
                        order++;
                    }
                }
            }
            chai.expect(order).to.equal(100);
        });
    });
    describe("filledGrid (it will take ~10 seconds)", () => {
        it("should have 20 words", async () => {

            return grid.returnFilledGrid(0)
                .then((filledGrid: GridService) => {
                    chai.expect(grid.words.length).to.equal(MAX_WORDS);
                });

        }).timeout(20000);
        it("should have the index at the right place", () => {
            chai.expect(grid.words[0].index).to.equal(1);
            chai.expect(grid.words[19].index).to.equal(10);
        });
        it("should have defined word", () => {
            chai.expect(grid.words[5].toString()).not.to.equal(undefined);
            chai.expect(grid.words[10].toString()).not.to.equal(undefined);
            chai.expect(grid.words[15].toString()).not.to.equal(undefined);
            chai.expect(grid.words[8].toString()).not.to.equal(undefined);
            chai.expect(grid.words[9].toString()).not.to.equal(undefined);
        });
        it("should have defined definition", () => {
            chai.expect(grid.words[1].definition).not.to.equal(undefined);
            chai.expect(grid.words[2].definition).not.to.equal(undefined);
            chai.expect(grid.words[3].definition).not.to.equal(undefined);
            chai.expect(grid.words[18].definition).not.to.equal(undefined);
            chai.expect(grid.words[16].definition).not.to.equal(undefined);
        });
        it("Every row should have a word from left to right(10)", () => {
            let numberOfHorizontalWord: number = 0;
            for (let i: number = 1; i <= 10; i++) {
                for (const w of grid.words) {
                    if (w.isHorizontal && w.index === i) {
                        numberOfHorizontalWord++;
                    }
                }
            }
            chai.expect(numberOfHorizontalWord).to.equal(10);
        });
        it("Every col should have a word from top to bottom(10)", () => {
            let numberOfVerticalWord: number = 0;
            for (let i: number = 1; i <= 10; i++) {
                for (const w of grid.words) {
                    if (!w.isHorizontal && w.index === i) {
                        numberOfVerticalWord++;
                        break;
                    }
                }
            }
            chai.expect(numberOfVerticalWord).to.equal(10);
        });
        describe("Easy, Normal and Hard grids (should take 20 seconds total)", () => {
            it("the difficulty of this grid should be easy", () => {
                chai.expect(grid.difficulty).to.equal(0);
            });
            it("should have a normal grid (it will take ~10 seconds)", async () => {
                const gridNormal: GridService = new GridService();
                gridNormal.initializeLetters();

                return gridNormal.returnFilledGrid(1)
                    .then((filledGrid: GridService) => {
                        chai.expect(gridNormal.difficulty).to.equal(1);
                    });
            }).timeout(25000);
            it("should have hard grid (it will take ~10 seconds)", async () => {
                const gridHard: GridService = new GridService();
                gridHard.initializeLetters();

                return gridHard.returnFilledGrid(2)
                    .then((filledGrid: GridService) => {
                        chai.expect(gridHard.difficulty).to.equal(2);
                    });
            }).timeout(30000);
        });
        describe("miniGrids inside Grid", () => {
            it("createMiniGrids should make 4 miniGrids", () => {
                chai.expect(grid.miniGrids.length).to.equal(4);
            });
        });
    });
});
