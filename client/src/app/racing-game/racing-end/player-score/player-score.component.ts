import { Component, OnInit, Inject } from "@angular/core";
import { PlayerHighScore } from "../player-high-score";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighScoreDaoService } from "../../../DAO/high-score-dao.service";
import { HighScoreModel } from "../../../DAO/high-score-model";
import { Router } from "@angular/router";
import { Alert } from "../../../alert";

const TEXT_CHECKER: RegExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
const HIGH_SCORES_MAX_LENGTH: number = 5;
const TRACK_LIST_ROUTE: string = "track-list";
const ADD_SUCCESS_MESSAGE: string = "HighScore successfully added. Refreshing page...";
const ADD_FAILURE_MESSAGE: string = "Invalid name";

@Component({
    selector: "app-player-score",
    templateUrl: "./player-score.component.html",
    styleUrls: ["./player-score.component.css"]
})
export class PlayerScoreComponent implements OnInit {

    private allowAdd: boolean;
    private playerName: string;
    private highScores: HighScoreModel[];
    private alert: Alert;

    public constructor(@Inject(MAT_DIALOG_DATA) private race: PlayerHighScore, private highScoresDao: HighScoreDaoService,
                       private router: Router) {
        this.allowAdd = true;
        this.playerName = "";
        this.highScores = [];
        this.alert = new Alert();
    }

    public ngOnInit(): void {
        this.highScoresDao.getByTrackId(this.race.trackId).then((highScores) => {
            this.highScores = highScores;
            this.verifyPlayerScore();
        }).catch((err) => {
            console.error(err);
        });
    }

    public add(): void {
        if (TEXT_CHECKER.test(this.playerName)) {
            this.deleteLastHighScore();
            const newHighScore: HighScoreModel = { id: "", name: this.playerName, time: this.race.score, idTrack: this.race.trackId };
            this.highScoresDao.add(newHighScore).catch((err) => {
                console.error(err);
            });
            this.alert.successAlert(ADD_SUCCESS_MESSAGE);
            this.router.navigate([TRACK_LIST_ROUTE]);
            location.reload();
        } else {
            this.alert.failureAlert(ADD_FAILURE_MESSAGE);
        }
    }

    public verifyPlayerScore(): void {
        if (this.highScores.length >= HIGH_SCORES_MAX_LENGTH) {
            const lastScore: HighScoreModel = this.highScores[this.highScores.length - 1];
            if (this.race.score >= lastScore.time) {
                this.allowAdd = false;
            }
        }
    }

    public deleteLastHighScore(): void {
        if (this.highScores.length === HIGH_SCORES_MAX_LENGTH) {
            const lastScore: HighScoreModel = this.highScores[this.highScores.length - 1];
            this.highScoresDao.delete(lastScore.id).catch((err) => {
                console.error(err);
            });
        }
    }

    public getHighScores(): HighScoreModel[] {
        return this.highScores;
    }

    public getAllowAdd(): boolean {
        return this.allowAdd;
    }
}
