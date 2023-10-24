import { ReflectiveInjector } from "@angular/core";
import { async, fakeAsync, tick, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

const SUCCESS: string = "SUCCESS";
const TRACK_1_NAME: string = "Track 1";
const TRACK_2_NAME: string = "Track 2";
const INVALID_WORD: string = "    ";
const FAKE_ID: string = "08s4asd65";
const FAIL: string = "FAIL";

import { TrackDaoService } from "./track-dao.service";
import { Vector3 } from "three";
import { TrackModel } from "./track-model";

describe("TrackDaoService", () => {
  const injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
    { provide: ConnectionBackend, useClass: MockBackend },
    { provide: RequestOptions, useClass: BaseRequestOptions },
    Http, TrackDaoService,
  ]);
  const trackDaoService: TrackDaoService = injector.get(TrackDaoService);
  const backend: MockBackend = injector.get(ConnectionBackend) as MockBackend;
  let lastConnection: MockConnection;
  backend.connections.subscribe((connection: MockConnection) => lastConnection = connection);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [TrackDaoService]
    }).compileComponents().catch((err) => {
      console.error(err);
    });
  }));

  it("should add track", fakeAsync(() => {
    let result: string;
    const trackModel: TrackModel = {id: "", name: TRACK_1_NAME, description: TRACK_1_NAME, points: new Array<Vector3> (), timesPlayed: 0};
    trackDaoService.add(trackModel).then((saved: string) => result = saved).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));

  it("should not add track (invalid name)", fakeAsync(() => {
    let result: string;
    const trackModel: TrackModel = {id: "", name: INVALID_WORD, description: TRACK_1_NAME, points: new Array<Vector3> (), timesPlayed: 0};
    trackDaoService.add(trackModel).then((saved: string) => result = saved).catch((err) => {
      console.error(err);
    });
    tick();
    expect(result).toBe(FAIL);
  }));

  it("should update a track", fakeAsync(() => {
    let result: string;
    const trackModel: TrackModel = {id: "", name: TRACK_1_NAME, description: TRACK_1_NAME, points: new Array<Vector3> (), timesPlayed: 0};
    trackDaoService.update(trackModel).then((track: string) => result = track).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));

  it("should not update a track (invalid description)", fakeAsync(() => {
    let result: string;
    const trackModel: TrackModel = {id: "", name: TRACK_1_NAME, description: INVALID_WORD, points: new Array<Vector3> (), timesPlayed: 0};
    trackDaoService.update(trackModel).then((track: string) => result = track).catch((err) => {
      console.error(err);
    });
    tick();
    expect(result).toBe(FAIL);
  }));

  it("should get tracks", fakeAsync(() => {
    let result: string[];
    trackDaoService.getAll().then((tracks: string[]) => result = tracks).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify([TRACK_1_NAME, TRACK_2_NAME]),
    })));
    tick();
    expect(result.length).toEqual(2, "should contain given amount of tracks");
    expect(result[0]).toEqual(TRACK_1_NAME);
    expect(result[1]).toEqual(TRACK_2_NAME);
  }));

  it("should get a track", fakeAsync(() => {
    let result: TrackModel;
    trackDaoService.get(FAKE_ID).then((track: TrackModel) => result = track).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify({id: "", name: TRACK_1_NAME, description: TRACK_1_NAME, points: new Array<Vector3>(), timesPlayed: 0}),
    })));
    tick();
    expect(result.name).toBe(TRACK_1_NAME);
  }));

  it("should delete a track", fakeAsync(() => {
    let result: string;
    trackDaoService.delete(FAKE_ID).then((deleted: string) => result = deleted).catch((err) => {
      console.error(err);
    });
    lastConnection.mockRespond(new Response(new ResponseOptions({
      body: JSON.stringify(SUCCESS),
    })));
    tick();
    expect(result).toBe(SUCCESS);
  }));
});
