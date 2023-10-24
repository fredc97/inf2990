import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TrackResultsComponent } from "./track-results.component";
import { TrackResults, PlayerResults } from "../track-results";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from "@angular/material/dialog";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { TrackDaoService } from "../../../DAO/track-dao.service";
import { HttpModule } from "@angular/http";

const PLAYER_NAME: string = "Player";
const FIRST_PLAYER: string = "First player";
const LAST_PLAYER: string = "Last player";
// tslint:disable:no-magic-numbers
describe("TrackResultsComponent", () => {
  let component: TrackResultsComponent;
  let fixture: ComponentFixture<TrackResultsComponent>;
  const dialogData: TrackResults = {players: [], trackId: ""};
  for (let i: number = 0; i < 4; i++) {
    const player: PlayerResults = {
      playerName: PLAYER_NAME + i,
      time: { roundOne: new Date(1), roundTwo: new Date(1), roundThree: new Date(1) }
    };
    dialogData.players.push(player);
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: MAT_DIALOG_DATA, useValue: dialogData }, MatDialog, TrackDaoService],
      declarations: [TrackResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatDialogModule, HttpModule]
    })
      .compileComponents()
      .catch((err) => console.error(err));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  const firstPlayer: PlayerResults = {
    playerName: FIRST_PLAYER,
    time: { roundOne: new Date(0), roundTwo: new Date(0), roundThree: new Date(0) }
  };
  const lastPlayer: PlayerResults = {
    playerName: LAST_PLAYER,
    time: { roundOne: new Date(2), roundTwo: new Date(2), roundThree: new Date(2) }
  };
  dialogData.players.push(firstPlayer);
  dialogData.players.push(lastPlayer);
  it("Results should be sorted in ascending order by totalTime", () => {
    component.sortResults();
    expect(component.getResults()[0]).toEqual(firstPlayer);
    expect(component.getResults()[dialogData.players.length - 1]).toEqual(lastPlayer);
  });

  it("Total Time should be the sum of the 3 rounds", () => {
    const roundTime: Date = new Date(1);
    const fakePlayer: PlayerResults = {
      playerName: PLAYER_NAME,
      time: { roundOne: roundTime, roundTwo: roundTime, roundThree: roundTime }
    };
    const totalTime: Date = new Date(roundTime.getTime() + roundTime.getTime() + roundTime.getTime());
    expect(component.getTotalTime(fakePlayer)).toEqual(totalTime);
  });
});
