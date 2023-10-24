import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { TrackResults, PlayerResults } from "../track-results";
import { PlayerHighScore } from "../player-high-score";
import { PlayerScoreComponent } from "../player-score/player-score.component";
import { TrackDaoService } from "../../../DAO/track-dao.service";

@Component({
    selector: "app-track-results",
    templateUrl: "./track-results.component.html",
    styleUrls: ["./track-results.component.css"]
})
export class TrackResultsComponent implements OnInit, OnDestroy {

    private playerHighScore: PlayerHighScore;
    public constructor(@Inject(MAT_DIALOG_DATA) private results: TrackResults, private dialog: MatDialog,
                       private trackDao: TrackDaoService) { }

    public ngOnInit(): void {
        this.incrementTimesPlayed();
        const player: PlayerResults = this.results.players[0];
        this.playerHighScore = { trackId: this.results.trackId, score: this.getTotalTime(player) };
        this.sortResults();
        if (this.results.players.indexOf(player) !== 0) {
            this.playerHighScore.score = new Date(0);
        }
    }

    public ngOnDestroy(): void {
        this.dialog.open(PlayerScoreComponent, {
            data: this.playerHighScore
        });
    }

    public getTotalTime(result: PlayerResults): Date {
        const roundOne: number = result.time.roundOne.getTime();
        const roundTwo: number = result.time.roundTwo.getTime();
        const roundThree: number = result.time.roundThree.getTime();

        return new Date(roundOne + roundTwo + roundThree);
    }

    public sortResults(): void {
        this.results.players.sort((a, b) => {
            return this.getTotalTime(a).getTime() - this.getTotalTime(b).getTime();
        });
    }

    public getResults(): PlayerResults[] {
        return this.results.players;
    }

    private incrementTimesPlayed(): void {
        this.trackDao.get(this.results.trackId).then((track) => {
            track.timesPlayed = track.timesPlayed + 1;
            this.trackDao.update(track)
                .then()
                .catch((err) => console.error(err));

        }).catch((err) => console.error(err));
    }

}
