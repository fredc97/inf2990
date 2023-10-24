import { GridService } from "./grid.service";
import { Word } from "./word";
import { EASY, ANY, ENDEND, ENDSTART, STARTEND, STARTSTART, NORMAL, HARD, COMMON, UNCOMMON } from "./crossword-backend-constants";
import * as chai from "chai";

// tslint:disable:no-magic-numbers

describe("WordManipulator", () => {
    const grid: GridService = new GridService();
    grid.initializeLetters();
    grid.createMiniGrids();
    grid.difficulty = EASY;
    const testString: string = "apple";
    const testWord: Word = grid.miniGrids[0].createWord([0, 4], 0);
    testWord.addLetters(testString, 1);
    grid.miniGrids[0].wordManipulator.words.push(testWord);
    describe("getDefinition", () => {
        it("should find the definition of a word", async () => {
            return grid.miniGrids[0].wordManipulator.getDef(testString)
                .then((words: string) => {
                    chai.expect(words[0])
                        .to.equal("native Eurasian tree widely cultivated in many varieties for its firm rounded edible fruits");
                });
        }).timeout(15000);
        it("should get the right type with different difficulty (common or uncommon)", () => {
            const gridEasy: GridService = new GridService();
            gridEasy.initializeLetters();
            gridEasy.difficulty = EASY;
            gridEasy.createMiniGrids();
            const gridNormal: GridService = new GridService();
            gridNormal.initializeLetters();
            gridNormal.difficulty = NORMAL;
            gridNormal.createMiniGrids();
            const gridHard: GridService = new GridService();
            gridHard.initializeLetters();
            gridHard.difficulty = HARD;
            gridHard.createMiniGrids();

            chai.expect(gridEasy.miniGrids[0].wordManipulator.type).to.equal(COMMON);
            chai.expect(gridNormal.miniGrids[0].wordManipulator.type).to.equal(COMMON);
            chai.expect(gridHard.miniGrids[0].wordManipulator.type).to.equal(UNCOMMON);
        });
    });

    describe("getWord", () => {
        it("should find any word", async () => {
            return grid.miniGrids[0].wordManipulator.getWord(5, ANY)
                .then((word: string) => {
                    chai.expect(word).to.match(/^/).and.to.have.length(5);
                });
        }).timeout(15000);
        it("should find a word with the ENDEND dependancy", async () => {
            return grid.miniGrids[0].wordManipulator.getWord(5, ENDEND)
                .then((word: string) => {
                    chai.expect(word).to.match(/^[a-z][a-z][a-z][a-z]e/).and.to.have.length(5);
                });
        }).timeout(15000);
        it("should find a word with the ENDSTART dependancy", async () => {
            return grid.miniGrids[0].wordManipulator.getWord(5, ENDSTART)
                .then((word: string) => {
                    chai.expect(word).to.match(/^e[a-z][a-z][a-z][a-z]/).and.to.have.length(5);
                });
        }).timeout(15000);
        it("should find a word with the STARTEND dependancy", async () => {
            return grid.miniGrids[0].wordManipulator.getWord(5, STARTEND)
                .then((word: string) => {
                    chai.expect(word).to.match(/^[a-z][a-z][a-z][a-z]a/).and.to.have.length(5);
                });
        });
        it("should find a word with the STARTSTART dependancy", async () => {
            return grid.miniGrids[0].wordManipulator.getWord(5, STARTSTART)
                .then((word: string) => {
                    chai.expect(word).to.match(/^a[a-z][a-z][a-z][a-z]/).and.to.have.length(5);
                });
        }).timeout(15000);
    });
});
