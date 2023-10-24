import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from "@angular/core";
import { TrackCreatorService } from "../trackCreator.service";
import { Http } from "@angular/http";
import { TrackDaoService } from "../../DAO/track-dao.service";
import { Alert } from "../../alert";
import { TrackModel } from "../../DAO/track-model";
import { SUCCESS } from "../../../../../common/data-access-object-constants";
const ADD_SUCCESS_MESSAGE: string = "Track successfully added. Refreshing page...";
const ADD_FAILURE_MESSAGE: string = "Couldn't add the track. Name already exists or invalid name and description";

@Component({
    moduleId: module.id,
    selector: "app-racing-component",
    templateUrl: "./racing.component.html",
    styleUrls: ["./racing.component.css"]
})

export class RacingComponent implements AfterViewInit {

    @ViewChild("racingContainer")
    private containerRef: ElementRef;
    private track: TrackModel;
    private alert: Alert;
    public constructor(private trackCreatorService: TrackCreatorService, public http: Http, private trackDao: TrackDaoService) {
        this.track = { id: "", name: "", description: "", points: [], timesPlayed: 0 };
        this.alert = new Alert();
    }

    @HostListener("window:mousedown", ["$event"])
    public onKeyDown(event: MouseEvent): void {
        this.trackCreatorService.onMouseDown(event);
    }

    @HostListener("window:mouseup", ["$event"])
    public onKeyUp(event: MouseEvent): void {
        this.trackCreatorService.onMouseUp(event);
    }

    public ngAfterViewInit(): void {
        this.track.name = "abc";
        this.trackCreatorService
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }

    public getAlert(): Alert {
        return this.alert;
    }

    public setTrackModel(track: TrackModel): void {
        this.track = track;
    }

    public add(): void {
        if (this.isComplete()) {
            this.track.points = this.trackCreatorService.getTab();
            this.trackDao.add(this.track).then((addResponse: string) => {
                this.alert.successAlert(ADD_SUCCESS_MESSAGE);
                if (addResponse === SUCCESS) {
                    location.reload();
                } else {
                    this.update();
                }
            }).catch((err) => {
                console.error(err);
            });
        }
    }

    public update(): void {
        this.trackDao.update(this.track).then((updateResponse: string) => {
            if (updateResponse === SUCCESS) {
                location.reload();
            } else {
                this.alert.failureAlert(ADD_FAILURE_MESSAGE);
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    public isComplete(): boolean {
        const textIsEmpty: boolean = this.track.name !== "" && this.track.description !== "";

        return (textIsEmpty && this.trackCreatorService.getTrackState());
    }
}
