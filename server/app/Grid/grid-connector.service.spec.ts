import chaiHttp = require("chai-http");
import * as chai from "chai";
import { GridInterface } from "../../../common/interfaces/grid-interface";
const GRID_CONNECTOR_URL: string = "http://localhost:3000/grid/";

// tslint:disable:no-magic-numbers
describe("GridConnectorService", () => {
    chai.use(chaiHttp);
    it("should generate and send 20 words", (done: MochaDone) => {
        chai.request(GRID_CONNECTOR_URL).get("0").end((err: boolean, res: ChaiHttp.Response) => {
            const gridGenerated: GridInterface = JSON.parse(res.text);
            chai.expect(gridGenerated._words.length).to.equal(20);
            done();
        });
    }).timeout(15000);
    it("should send 100 letters", (done: MochaDone) => {
        chai.request(GRID_CONNECTOR_URL).get("0").end((err: boolean, res: ChaiHttp.Response) => {
            const gridGenerated: GridInterface = JSON.parse(res.text);
            chai.expect(gridGenerated._letters.length).to.equal(10);
            done();
        });
    }).timeout(15000);
    it("should send the difficulty", (done: MochaDone) => {
        chai.request(GRID_CONNECTOR_URL).get("0").end((err: boolean, res: ChaiHttp.Response) => {
            const gridGenerated: GridInterface = JSON.parse(res.text);
            chai.expect(gridGenerated._difficulty).to.equal(0);
            done();
        });
    }).timeout(15000);
});
