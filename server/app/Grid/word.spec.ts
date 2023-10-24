
import { Letter } from "./letter";
import { Word } from "./word";
import * as chai from "chai";
import { EMPTY } from "../../../common/crossword-constants";
// tslint:disable:no-magic-numbers

describe("Words", () => {
    describe("words look", () => {
        describe("replaceAccents", () => {
            it("Should replace any accents", () => {
                const chars: string = "ÀÁÂÃÄ";
                const wordobj: Word = new Word(true);
                chai.expect(wordobj.replaceAccents(chars)).to.equal("AAAAA");
            });
        });
        describe("ignoreRepresentation", () => {
            it("Should ignore hyphen and apostrophe", () => {
                const word1: string = "m'as-tu-vu";
                const wordobj1: Word = new Word(true);
                chai.expect(wordobj1.ignoreRepresentation(word1)).to.equal("mastuvu");
            });
        });
    });

    describe("adding letters to Word", () => {
        describe("addLetters", () => {
            it("Should add letters to the empty Word", () => {
                const word2: Word = new Word(true);
                for (let i: number = 0; i < 6; i++) {
                    word2.letters.push(new Letter(1, 1));
                }
                const aword: string = "manger";
                const ordre: number = 1;
                word2.addLetters(aword, ordre);
                let wordfinal: string = EMPTY;
                for (let i: number = 0; i < 6; i++) {
                    wordfinal += word2.letters[i].character;
                }

                chai.expect(wordfinal).to.equal("manger");

            });
            it("Should add letters to the empty Word even with accents", () => {
                const word2: Word = new Word(true);
                for (let i: number = 0; i < 6; i++) {
                    word2.letters.push(new Letter(1, 1));
                }
                const aword: string = "èÈéâêè";
                const ordre: number = 1;
                word2.addLetters(aword, ordre);
                let wordfinal: string = EMPTY;
                for (let i: number = 0; i < 6; i++) {
                    wordfinal += word2.letters[i].character;
                }

                chai.expect(wordfinal).to.equal("eEeaee");

            });
            describe("letters manipulation (and letters set)", () => {
                const word2: Word = new Word(true);
                const letter1: Letter = new Letter(1, 0);
                const letter2: Letter = new Letter(1, 1);
                const letter3: Letter = new Letter(1, 2);
                const letter4: Letter = new Letter(1, 3);
                const letter5: Letter = new Letter(1, 4);
                const letter6: Letter = new Letter(1, 5);
                letter1.character = "o";
                letter2.character = "r";
                letter3.character = "a";
                letter4.character = "n";
                letter5.character = "g";
                letter6.character = "e";
                word2.letters.push(letter1);
                word2.letters.push(letter2);
                word2.letters.push(letter3);
                word2.letters.push(letter4);
                word2.letters.push(letter5);
                word2.letters.push(letter6);
                it("Should not change the current letters", () => {
                    const aword: string = "manger";
                    const ordre: number = 1;
                    word2.addLetters(aword, ordre);
                    let wordfinal: string = EMPTY;
                    for (let i: number = 0; i < 6; i++) {
                        wordfinal += word2.letters[i].character;
                    }
                    chai.expect(wordfinal).to.equal("orange");
                });
                it("Should change the object word to string", () => {
                    chai.expect(word2.toString()).to.equal("orange");
                });
            });
        });
    });
    const word: Word = new Word(true);
    describe("Setters", () => {
        it("Should set index", () => {
            word.index = 5;
            chai.expect(word.index).to.equal(5);
        });

        it("Should set order", () => {
            word.order = 8;
            chai.expect(word.order).to.equal(8);
        });
        it("should set definition", () => {
            const definition: string[] = ["1"];
            word.definition = definition[0];
            chai.expect(word.definition[0]).to.equal("1");
        });

    });
    describe("Getters", () => {
        it("Should get the index", () => {
            chai.expect(word.index).to.equal(5);
        });
        it("Should get order", () => {
            chai.expect(word.order).to.equal(8);
        });
    });
});
