import { ReflectiveInjector } from "@angular/core";
import { async, fakeAsync, tick, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

const SUCCESS: string = "SUCCESS";
const HIGH_SCORE_1_NAME: string = "HighScore 1";
const HIGH_SCORE_2_NAME: string = "HighScore 2";
const FAKE_ID: string = "08s4asd65";
const TRACK_ID: string = "08s4asd55";

import { HighScoreDaoService } from "./high-score-dao.service";
import { HighScoreModel } from "./high-score-model";

describe("HighScoreDaoService", () => {
  const injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
    { provide: ConnectionBackend, useClass: MockBackend },
    { provide: RequestOptions, useClass: BaseRequestOptions },
    Http, HighScoreDaoService,
  ]);
  const highScoreDaoService: HighScoreDaoService = injector.get(HighScoreDaoService);
  const backend: MockBackend = injector.get(ConnectionBackend) as MockBackend;
  let lastConnection: MockConnection;
  backend.connections.subscribe((connection: MockConnection) => lastConnection = connection);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [HighScoreDaoService]
    }).compileComponents().catch((err) => {
      console.error(err);
    });
  }));

  it("should add highScore", fakeAsync(() => {
    let result: string;
    const highScoreModel: HighScoreModel = {id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID};
    highScoreDaoService.add(highScoreModel).then((saved: string) => result = saved).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));

  it("should update a highScore", fakeAsync(() => {
    let result: string;
    const highScoreModel: HighScoreModel = {id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID};
    highScoreDaoService.update(highScoreModel).then((highScore: string) => result = highScore).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));

  it("should get highScores", fakeAsync(() => {
    let result: string[];
    highScoreDaoService.getAll().then((highScores: string[]) => result = highScores).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify([HIGH_SCORE_1_NAME, HIGH_SCORE_2_NAME]),
    })));
    tick();
    expect(result.length).toEqual(2, "should contain given amount of highScores");
    expect(result[0]).toEqual(HIGH_SCORE_1_NAME);
    expect(result[1]).toEqual(HIGH_SCORE_2_NAME);
  }));

  it("should get highScores by Track id", fakeAsync(() => {
    let result: HighScoreModel[];
    highScoreDaoService.getByTrackId(TRACK_ID).then((highScores: HighScoreModel[]) => result = highScores).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify([{id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID},
                            {id: FAKE_ID, name: HIGH_SCORE_2_NAME, time: new Date(0), idTrack: TRACK_ID}]),
    })));
    tick();
    expect(result.length).toEqual(2, "should contain given amount of highScores");
    expect(result[0].name).toEqual(HIGH_SCORE_1_NAME);
    expect(result[1].name).toEqual(HIGH_SCORE_2_NAME);
  }));

  it("should get a highScore", fakeAsync(() => {
    let result: HighScoreModel;
    highScoreDaoService.get(FAKE_ID).then((highScore: HighScoreModel) => result = highScore).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID}),
    })));
    tick();
    expect(result.name).toBe(HIGH_SCORE_1_NAME);
  }));

  it("should get highScores by Track id", fakeAsync(() => {
    let result: HighScoreModel;
    highScoreDaoService.get(FAKE_ID).then((highScore: HighScoreModel) => result = highScore).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID}),
    })));
    tick();
    expect(result.name).toBe(HIGH_SCORE_1_NAME);
  }));

  it("should =e a highScore", fakeAsync(() => {
    let result: string;
    highScoreDaoService.delete(FAKE_ID).then((deleted: string) => result = deleted).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));

  it("should delete a all highScores", fakeAsync(() => {
    let result: string;
    highScoreDaoService.deleteAllByTrackId(FAKE_ID).then((deleted: string) => result = deleted).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));
});
