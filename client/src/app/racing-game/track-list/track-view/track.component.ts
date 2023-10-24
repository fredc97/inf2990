import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { ViewTrackService } from "./viewTrack.service";

@Component({
    moduleId: module.id,
    selector: "app-track-component",
    templateUrl: "./track.component.html",
    styleUrls: ["./track.component.css"]
})

export class TrackComponent implements AfterViewInit {

    @ViewChild("editorContainer")
    private containerRef: ElementRef;

    public constructor(private trackservice: ViewTrackService) { }

    public ngAfterViewInit(): void {
        this.trackservice
            .initialize(this.containerRef.nativeElement)
            .then(/* do nothing */)
            .catch((err) => console.error(err));
    }
}
