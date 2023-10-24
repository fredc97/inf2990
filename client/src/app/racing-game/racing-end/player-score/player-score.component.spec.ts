import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PlayerScoreComponent } from "./player-score.component";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HighScoreDaoService } from "../../../DAO/high-score-dao.service";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule } from "@angular/http";
import { PlayerHighScore } from "../player-high-score";
import { HighScoreModel } from "../../../DAO/high-score-model";
// import { Router, RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

const HIGH_SCORE_1_NAME: string = "HighScore 1";
const FAKE_ID: string = "08s4asd65";
const TRACK_ID: string = "08s4asd55";

// tslint:disable:no-magic-numbers

describe("PlayerScoreComponent", () => {
  let component: PlayerScoreComponent;
  let fixture: ComponentFixture<PlayerScoreComponent>;
  const data: PlayerHighScore = { trackId: "515151", score: new Date(5) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule, HttpModule, RouterTestingModule],
      declarations: [PlayerScoreComponent],
      providers: [HighScoreDaoService, { provide: MAT_DIALOG_DATA, useValue: data }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents()
      .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("The player should be allowed to add his score. (There are only 3 high scores and the limit is 5)", () => {
    const highScores: HighScoreModel[] = component.getHighScores();
    for (let i: number = 0; i < 3; i++) {
      highScores.push({id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID});
    }
    component.verifyPlayerScore();
    expect(component.getAllowAdd()).toEqual(true);
  });

  it("The player should be allowed to add his score. (There are 5 high scores, but the player's score is better than one of them)", () => {
    const highScores: HighScoreModel[] = component.getHighScores();
    for (let i: number = 0; i < 5; i++) {
      highScores.push({id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(10), idTrack: TRACK_ID});
    }
    component.verifyPlayerScore();
    expect(component.getAllowAdd()).toEqual(true);
  });

  it("The player should not be allowed to add his score. (There are 5 high scores and the player's score is not good enough", () => {
    const highScores: HighScoreModel[] = component.getHighScores();
    for (let i: number = 0; i < 5; i++) {
      highScores.push({id: FAKE_ID, name: HIGH_SCORE_1_NAME, time: new Date(0), idTrack: TRACK_ID});
    }
    component.verifyPlayerScore();
    expect(component.getAllowAdd()).toEqual(false);
  });
});
