import { Letter } from "./letter";
import * as chai from "chai";
// tslint:disable:no-magic-numbers

describe("Letter", () => {

    const letter: Letter = new Letter(0, 2);
    describe("Setters", () => {
        it("Should set blank", () => {
            letter.isBlank = true;
            chai.expect(letter.isBlank).to.equal(true);
        });
        it("Should set character", () => {
            letter.character = "A";
            chai.expect(letter.character).to.equal("A");
        });
        it("Should set order", () => {

            letter.order = 10;
            chai.expect(letter.order).to.equal(10);
        });
    });
    describe("Getters", () => {
        it("Should get the character", () => {
            chai.expect(letter.character).to.equal("A");
        });
        it("Should get the row", () => {
            chai.expect(letter.row).to.equal(0);
        });
        it("Should get the col", () => {
            chai.expect(letter.col).to.equal(2);
        });
        it("Should get the order", () => {
            chai.expect(letter.order).to.equal(10);
        });
        it("Should get if it is blank", () => {
            chai.expect(letter.isBlank).to.equal(true);
        });
    });
});
