import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import {GridConnectorService} from "./Grid/grid-connector.service";
import { Routes } from "./routes";
import { LexicalService } from "./lexical-service/lexical-service";
import { TrackDAOService } from "./DataBase/track/track-dao.service";
import { HighScoresDAOService } from "./DataBase/high-scores/high-scores-dao.service";
import { SocketService } from "./socket-service/socket.service";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.Index).to(Index);
container.bind(Types.LexicalService).to(LexicalService);
container.bind(Types.TrackDAOService).to(TrackDAOService);
container.bind(Types.SocketService).to(SocketService);
container.bind(Types.HighScoresDAOService).to(HighScoresDAOService);
container.bind(Types.GridConnectorService).to(GridConnectorService);
export { container };
