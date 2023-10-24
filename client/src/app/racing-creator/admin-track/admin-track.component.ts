import { Component, OnInit, ViewChild } from "@angular/core";
import { TrackDaoService } from "../../DAO/track-dao.service";
import { HighScoreDaoService } from "../../DAO/high-score-dao.service";
import { TrackCreatorService } from "../trackCreator.service";
import { RacingComponent } from "../racing-component/racing.component";

const EDIT_ERROR_MESSAGE: string = "Can't edit another track. Refresh the page in order to edit another track";

@Component({
    selector: "app-admin-track",
    templateUrl: "./admin-track.component.html",
    styleUrls: ["./admin-track.component.css"]
})
export class AdminTrackComponent implements OnInit {

    @ViewChild(RacingComponent) private child: RacingComponent;
    private tracks: string[];
    private isEdited: boolean;
    public constructor(private trackDao: TrackDaoService, private trackCreatorService: TrackCreatorService,
                       private highScoreDao: HighScoreDaoService) {
        this.isEdited = true;
    }

    public getTracks(): string[] {
        return this.tracks;
    }

    public ngOnInit(): void {
        this.trackDao.getAll().then((tracks) => {
            this.tracks = tracks;
        }).catch((err) => {
            console.error(err);
        });
    }

    public delete(id: string): void {
        this.trackDao.delete(id).catch((err) => {
            console.error(err);
        });
        this.highScoreDao.deleteAllByTrackId(id).catch((err) => {
            console.error(err);
        });
        location.reload();
    }

    public edit(id: string): void {
        if (this.isEdited) {
            this.trackDao.get(id).then((track) => {
                this.trackCreatorService.setTrack(track.points);
                this.child.setTrackModel(track);
            }).catch((err) => {
                console.error(err);
            });
            this.isEdited = false;
        } else {
            this.child.getAlert().failureAlert(EDIT_ERROR_MESSAGE);
        }
    }
}
