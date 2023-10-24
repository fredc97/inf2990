import chaiHttp = require("chai-http");
import * as mongoose from "mongoose";
import HighScoresModel from "./high-scores.model";
const HIGHSCORES_URL: String = "http://localhost:3000/db/highScores/";
const TEST: String = "test";
const SUCCESS: String = "SUCCESS";

describe("HighScoresDAOService", () => {
    // tslint:disable-next-line:no-any
    const chai: any = require("chai");
    chai.use(chaiHttp);
    it("should add two new highScores", (done: MochaDone) => {
        const highScore: mongoose.Document = new HighScoresModel({
            name: TEST,
            time: 0,
            idTrack: TEST
        });
        // tslint:disable-next-line:no-any
        chai.request(HIGHSCORES_URL).post("add").send({ highScore }).end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            chai.expect(result).to.equal(SUCCESS);
        });
        chai.request(HIGHSCORES_URL).post("add").send({ highScore }).end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            chai.expect(result).to.equal(SUCCESS);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should get at least one highScore", (done: MochaDone) => {
        chai.request(HIGHSCORES_URL).get("getAll").end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            chai.expect(result).to.have.lengthOf.above(0);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should get the two added highScores", (done: MochaDone) => {
        chai.request(HIGHSCORES_URL).get("getByTrackId/" + TEST).end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            // tslint:disable-next-line:no-magic-numbers
            chai.expect(result).to.have.lengthOf(2);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should get the created highScore", (done: MochaDone) => {
        chai.request(HIGHSCORES_URL).get("getLast").end((getLasterr: boolean, getLastRes: ChaiHttp.Response) => {
            chai.request(HIGHSCORES_URL).get("get/" + JSON.parse(getLastRes.text)).end((err: boolean, getRes: ChaiHttp.Response) => {
                const result: string = JSON.parse(getRes.text).name;
                chai.expect(result).to.equal(TEST);
                done();
            });
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should delete the added highScore", (done: MochaDone) => {
        chai.request(HIGHSCORES_URL).get("getLast").end((getLasterr: boolean, getRes: ChaiHttp.Response) => {
            chai.request(HIGHSCORES_URL).delete("delete/" + JSON.parse(getRes.text)).end((err: boolean, delRes: ChaiHttp.Response) => {
                const result: string = JSON.parse(delRes.text);
                chai.expect(result).to.equal(SUCCESS);
                done();
            });
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should delete every highScore with id_track", (done: MochaDone) => {
        chai.request(HIGHSCORES_URL).delete("deleteAll/" + TEST).end((err: boolean, delRes: ChaiHttp.Response) => {
            const result: string = JSON.parse(delRes.text);
            chai.expect(result).to.equal(SUCCESS);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);
});
