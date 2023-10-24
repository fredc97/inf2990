import chaiHttp = require("chai-http");
import * as mongoose from "mongoose";
import TrackModel from "./track.model";
const TRACK_URL: String = "http://localhost:3000/db/track/";
const TEST: String = "test";
const SUCCESS: String = "SUCCESS";

describe("TrackDaoService", () => {
    // tslint:disable-next-line:no-any
    const chai: any = require("chai");
    chai.use(chaiHttp);
    it("should add a new track", (done: MochaDone) => {
        const track: mongoose.Document = new TrackModel({
            name: TEST,
            description: TEST,
            timesPlayed: 0,
            points: []
        });
        chai.request(TRACK_URL).post("add").send({track}).end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            chai.expect(result).to.equal(SUCCESS);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should get at least one track", (done: MochaDone) => {
        chai.request(TRACK_URL).get("getAll").end((err: boolean, res: ChaiHttp.Response) => {
            const result: string = JSON.parse(res.text);
            chai.expect(result).to.have.lengthOf.above(0);
            done();
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should get the created track", (done: MochaDone) => {
        chai.request(TRACK_URL).get("getLast").end((getLasterr: boolean, getAllRes: ChaiHttp.Response) => {
            chai.request(TRACK_URL).get("get/" + JSON.parse(getAllRes.text)).end((err: boolean, getRes: ChaiHttp.Response) => {
                const result: string = JSON.parse(getRes.text).name;
                chai.expect(result).to.equal(TEST);
                done();
            });
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);

    it("should delete the added track", (done: MochaDone) => {
        chai.request(TRACK_URL).get("getLast").end((getLasterr: boolean, getRes: ChaiHttp.Response) => {
            chai.request(TRACK_URL).delete("delete/" + JSON.parse(getRes.text)).end((err: boolean, delRes: ChaiHttp.Response) => {
                const result: string = JSON.parse(delRes.text);
                chai.expect(result).to.equal(SUCCESS);
                done();
            });
        });
        // tslint:disable-next-line:no-magic-numbers
    }).timeout(15000);
});
