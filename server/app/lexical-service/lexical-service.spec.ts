
import * as chai from "chai";
import chaiHttp = require("chai-http");

describe("LexicalService", () => {
    chai.use(chaiHttp);
    describe("Testing getDefinition", () => {
        it("should return the definition of money", (done: MochaDone) => {
            // tslint:disable-next-line:no-any
            chai.request("http://localhost:3000/api/lexicalService/").get("definition/money").end((err: any, res: any) => {
                const definitions: string = JSON.parse(res.text);
                chai.expect(definitions[0]).to.equal("the most common medium of exchange; functions as legal tender");
                done();
            });
        // tslint:disable-next-line:no-magic-numbers
        }).timeout(15000);
    });
    describe("Testing getWordByLength", () => {
        it("should return a random word with a length of 5", (done: MochaDone) => {
            // tslint:disable-next-line:no-any
            chai.request("http://localhost:3000/api/lexicalService/").get("randomWordByLength/common/5").end((err: any, res: any) => {
                const word: string = JSON.parse(res.text);
                // tslint:disable-next-line:no-magic-numbers
                chai.expect(word).to.to.have.lengthOf(5);
                done();
            });
        // tslint:disable-next-line:no-magic-numbers
        }).timeout(15000);
    });
    describe("Testing getWordByLetters", () => {
        it("should return a random word starting with au", (done: MochaDone) => {
            // tslint:disable-next-line:no-any
            chai.request("http://localhost:3000/api/lexicalService/").get("randomWordByLetters/uncommon/^au").end((err: any, res: any) => {
                const word: string = JSON.parse(res.text);
                chai.expect(word).to.match(/^au/);
                done();
            });
        // tslint:disable-next-line:no-magic-numbers
        }).timeout(15000);
    });
    describe("Testing getWordByLettersAndLength", () => {
        it("should return a random word starting with au et length max =5", (done: MochaDone) => {
            // tslint:disable-next-line:no-any
            chai.request("http://localhost:3000/api/lexicalService/").get("randomWordByLettersAndLengthMax/uncommon/^c[a-z]/5")
            .end((err: string, res: ChaiHttp.Response) => {
                const word: string = JSON.parse(res.text);
                // tslint:disable-next-line:no-magic-numbers
                chai.expect(word).to.match(/^c/).and.to.have.length.lessThan(6);
                done();
            });
        // tslint:disable-next-line:no-magic-numbers
        }).timeout(15000);
    });
});
