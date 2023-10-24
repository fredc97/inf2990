import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnDestroy } from "@angular/core";
import { RenderService } from "../render-service/render.service";
import { TrackResults } from "../racing-end/track-results";
import { MatDialog } from "@angular/material/dialog";
import { TrackResultsComponent } from "../racing-end/track-results/track-results.component";
import { EventHandlerService } from "../event-handler.service";
import { Router, ActivatedRoute } from "@angular/router";
import { GameControllerService } from "../game-controller.service";
import { Player } from "../player";
const TRACK_LIST_ROUTE: string = "track-list";
const PLAYER_NAME: string = "You";
const COMPUTER_NAME: string = "AI";

@Component({
    moduleId: module.id,
    selector: "app-game-component",
    templateUrl: "./game.component.html",
    styleUrls: ["./game.component.css"]
})

export class GameComponent implements AfterViewInit, OnDestroy {

    @ViewChild("container")
    private containerRef: ElementRef;
    private playing: boolean;
    private dialogOpened: boolean;
    public constructor(private renderService: RenderService, private dialog: MatDialog, private eventHandler: EventHandlerService,
                       private router: Router, private gameController: GameControllerService, private activatedRoute: ActivatedRoute) {
        this.dialogOpened = false;
        this.playing = true;
    }

    @HostListener("window:resize", ["$event"])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener("window:keydown", ["$event"])
    public onKeyDown(event: KeyboardEvent): void {
        if (this.eventHandler.keyDownRegister.has(event.keyCode)) {
            this.eventHandler.keyDownRegister.get(event.keyCode)();
        }
    }

    @HostListener("window:keyup", ["$event"])
    public onKeyUp(event: KeyboardEvent): void {
        if (this.eventHandler.keyUpRegister.has(event.keyCode)) {
            this.eventHandler.keyUpRegister.get(event.keyCode)();
        }
    }

    public ngAfterViewInit(): void {
        this.renderService
            .initialize(this.containerRef.nativeElement)
            .then(() => {
                this.gameController.init();
                this.subscribeToRaceProgress();
            })
            .catch((err) => {
                this.router.navigate([TRACK_LIST_ROUTE]);
                location.reload();
            });
    }

    public ngOnDestroy(): void {
        location.reload();
    }

    private openDialog(): void {
        this.dialog.open(TrackResultsComponent, {
            data: this.generateTrackResults()
        });
    }

    private subscribeToRaceProgress(): void {
        this.gameController.getProgressValue().subscribe((value) => {
            this.playing = value;
            if (!this.playing && !this.dialogOpened) {
                this.gameController.getProgressValue().unsubscribe();
                this.openDialog();
                this.dialogOpened = true;
            }
        });
    }

    private generateTrackResults(): TrackResults {
        const trackResults: TrackResults = { players: [], trackId: "" };
        this.activatedRoute.params.subscribe((param) => trackResults.trackId = param.id);
        const players: Player[] = this.renderService.getPlayers();

        for (let i: number = 0; i < players.length; i++) {
            const name: string = (i === 0) ? PLAYER_NAME : COMPUTER_NAME + i;
            const roundsTime: Date[] = players[i].getRoundsTime();

            trackResults.players.push({
                playerName: name,
                time: { roundOne: roundsTime[0], roundTwo: roundsTime[1], roundThree: roundsTime[2] }
            });
        }

        return trackResults;
    }
}
