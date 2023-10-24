import { Component, OnInit, Inject } from "@angular/core";
import { HighScoreDaoService } from "../../../DAO/high-score-dao.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PlayerHighScore } from "../../racing-end/player-high-score";
import { HighScoreModel } from "../../../DAO/high-score-model";

@Component({
    selector: "app-high-scores",
    templateUrl: "./high-scores.component.html",
    styleUrls: ["./high-scores.component.css"]
})
export class HighScoresComponent implements OnInit {

    private highScores: HighScoreModel[];
    public constructor(private highScoreDao: HighScoreDaoService, @Inject(MAT_DIALOG_DATA) private highScore: PlayerHighScore) {
    }

    public ngOnInit(): void {
        this.highScoreDao.getByTrackId(this.highScore.trackId).then((highScores) => {
            this.highScores = highScores;
        }).catch((err) => {
            console.error(err);
        });
    }

}
