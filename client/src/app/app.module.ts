import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MatDialogModule } from "@angular/material/dialog";

import { AppComponent } from "./app.component";
import { GameComponent } from "./racing-game/game-component/game.component";
import { GridComponent } from "./cross-word/grid/grid.component";
import { RacingComponent } from "./racing-creator/racing-component/racing.component";
import { CrosswordSettingComponent } from "./crossword-setting/crossword-setting.component";
import { TrackListComponent } from "./racing-game/track-list/track-list/track-list.component";
import { HighScoresComponent } from "./racing-game/track-list/high-scores/high-scores.component";
import { AdminTrackComponent } from "./racing-creator/admin-track/admin-track.component";
import { PlayerScoreComponent } from "./racing-game/racing-end/player-score/player-score.component";
import { TrackResultsComponent } from "./racing-game/racing-end/track-results/track-results.component";

import { BasicService } from "./basic.service";
import { TrackCreatorService } from "./racing-creator/trackCreator.service";
import { RenderService } from "./racing-game/render-service/render.service";
import { TrackDaoService } from "./DAO/track-dao.service";
import { HighScoreDaoService } from "./DAO/high-score-dao.service";
import { GridService } from "./cross-word/grid/grid.service";
import { CrosswordService } from "./cross-word/grid/crossword.service";
import { TrackComponent } from "./racing-game/track-list/track-view/track.component";
import { ViewTrackService } from "./racing-game/track-list/track-view/viewTrack.service";
import { SocketClientService } from "../app/cross-word/grid/socketClient.service";
import { CollisionDetectionService } from "./racing-game/collision/collision-detection.service";
import { CollisionResolverService } from "./racing-game/collision/collision-resolver.service";
import { EventHandlerService } from "./racing-game/event-handler.service";
import { SearchService } from "./cross-word/grid/search.service";
import { IdService } from "./cross-word/grid/id.service";
import { GameControllerService } from "./racing-game/game-controller.service";

const appRoutes: Routes = [
  { path: "crossword", component: GridComponent },
  { path: "racing/:id", component: GameComponent },
  { path: "crossword-setting", component: CrosswordSettingComponent },
  { path: "admin-track", component: AdminTrackComponent },
  { path: "track/:id", component: TrackComponent },
  { path: "track-list", component: TrackListComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GridComponent,
    CrosswordSettingComponent,
    RacingComponent,
    AdminTrackComponent,
    TrackListComponent,
    TrackComponent,
    HighScoresComponent,
    PlayerScoreComponent,
    TrackResultsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    HttpModule,
    FormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  entryComponents: [
    TrackListComponent,
    PlayerScoreComponent,
    HighScoresComponent,
    TrackResultsComponent
  ],
  providers: [
    ViewTrackService,
    TrackCreatorService,
    BasicService,
    RenderService,
    TrackDaoService,
    GridService,
    CrosswordService,
    SearchService,
    IdService,
    SocketClientService,
    HighScoreDaoService,
    CollisionDetectionService,
    CollisionResolverService,
    EventHandlerService,
    GameControllerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
