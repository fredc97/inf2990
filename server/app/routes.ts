import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";

import Types from "./types";
import { Index } from "./routes/index";
import { GridConnectorService } from "./Grid/grid-connector.service";
import { LexicalService } from "./lexical-service/lexical-service";
import { HighScoresDAOService } from "./DataBase/high-scores/high-scores-dao.service";
import { TrackDAOService } from "./DataBase/track/track-dao.service";

@injectable()
export class Routes {

    public constructor( @inject(Types.Index) private index: Index,
                        @inject(Types.LexicalService) private lexical: LexicalService,
                        @inject(Types.TrackDAOService) private track: TrackDAOService,
                        @inject(Types.HighScoresDAOService) private highScores: HighScoresDAOService,
                        @inject(Types.GridConnectorService) private gridConnector: GridConnectorService
    ) { }

    public get routes(): Router {
        const router: Router = Router();

        router.get("/",
                   (req: Request, res: Response, next: NextFunction) => this.index.helloWorld(req, res, next));
        router.get("/api/lexicalService/definition/:word",
                   async(req: Request, res: Response) => this.lexical.getDefinitions(req, res));
        router.get("/api/lexicalService/randomWordByLength/:frequency/:length",
                   async(req: Request, res: Response) => this.lexical.getWordByLength(req, res));
        router.get("/api/lexicalService/randomWordByLetters/:frequency/:letters",
                   async(req: Request, res: Response) => this.lexical.getWordByLetters(req, res));
        router.get("/api/lexicalService/randomWordByLettersAndLengthMax/:frequency/:letters/:length",
                   async(req: Request, res: Response) => this.lexical.getWordByLettersAndLength(req, res));

        router.post("/db/track/add/",
                    async(req: Request, res: Response) => this.track.add(req, res));
        router.put("/db/track/update/",
                   async(req: Request, res: Response) => this.track.update(req, res));
        router.delete("/db/track/delete/:id",
                      async(req: Request, res: Response) => this.track.delete(req, res));
        router.get("/db/track/getAll",
                   async(req: Request, res: Response) => this.track.getAll(req, res));
        router.get("/db/track/get/:id",
                   async(req: Request, res: Response) => this.track.get(req, res));
        router.get("/db/track/getLast",
                   async(req: Request, res: Response) => this.track.getLastTrackId(req, res));

        router.post("/db/highScores/add/",
                    async(req: Request, res: Response) => this.highScores.add(req, res));
        router.put("/db/highScores/update/",
                   async(req: Request, res: Response) => this.highScores.update(req, res));
        router.delete("/db/highScores/delete/:id",
                      async(req: Request, res: Response) => this.highScores.delete(req, res));
        router.delete("/db/highScores/deleteAll/:id",
                      async (req: Request, res: Response) => this.highScores.deleteAllByTrackId(req, res));
        router.get("/db/highScores/getAll",
                   async(req: Request, res: Response) => this.highScores.getAll(req, res));
        router.get("/db/highScores/get/:id",
                   async(req: Request, res: Response) => this.highScores.get(req, res));
        router.get("/db/highScores/getByTrackId/:id",
                   async(req: Request, res: Response) => this.highScores.getByTrackId(req, res));
        router.get("/db/highScores/getLast",
                   async(req: Request, res: Response) => this.highScores.getLastHighScoreId(req, res));

        router.get("/grid/:difficulty", async(req: Request, res: Response) => this.gridConnector.get(req, res));

        return router;
    }
}
