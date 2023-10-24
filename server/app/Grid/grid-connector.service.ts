import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import { GridService } from "./grid.service";

module Route {
    @injectable()
    export class GridConnectorService {
        public get(req: Request, res: Response): void {
            const difficulty: number = (Number(req.params.difficulty));
            const grid: GridService = new GridService();
            grid.returnFilledGrid(difficulty).then((filledGrid: GridService) => res.json(grid)).catch((err: string) => {
                return err;
            });
        }
    }
}
export = Route;
