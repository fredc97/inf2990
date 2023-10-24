import { Component, OnInit } from "@angular/core";
import { TrackDaoService } from "../../../DAO/track-dao.service";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ViewTrackService } from "../track-view/viewTrack.service";
import { PlayerHighScore } from "../../racing-end/player-high-score";
import { HighScoresComponent } from "../high-scores/high-scores.component";
import { GameControllerService } from "../../game-controller.service";

const PLAY_ROUTE: string = "/racing";
const VIEW_ROUTE: string = "/track";

@Component({
    selector: "app-track-list",
    templateUrl: "./track-list.component.html",
    styleUrls: ["./track-list.component.css"]
})
export class TrackListComponent implements OnInit {

    private tracks: string[];
    public constructor(private trackDao: TrackDaoService, private dialog: MatDialog, private router: Router,
                       private gameController: GameControllerService, private trackService: ViewTrackService) { }

    public ngOnInit(): void {
        this.trackDao.getAll().then((tracks) => {
            this.tracks = tracks;
        }).catch((err) => {
            console.error(err);
        });
    }

    public showHighScores(id: string): void {
        const dialogData: PlayerHighScore = { trackId: id, score: new Date() };
        this.dialog.open(HighScoresComponent, {
            data: dialogData
        });
    }

    public play(trackId: string): void {
        this.trackDao.get(trackId).then((track) => {
            this.trackService.setTrack(track.points);
            this.gameController.setPoints(track.points);
        }).catch((err) => {
            console.error(err);
        });
        this.router.navigate([PLAY_ROUTE, trackId]);
    }

    public view(trackId: string): void {
        this.trackDao.get(trackId).then((track) => {
            this.trackService.setTrack(track.points);
        }).catch((err) => {
            console.error(err);
        });
        this.router.navigate([VIEW_ROUTE, trackId]);
    }

    public apply(message: string): void {
        console.log(message);
    }

}
