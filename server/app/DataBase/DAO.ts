import { Request, Response } from "express";
import "reflect-metadata";

module Route {

    export interface DAO {
        getAll(req: Request, res: Response): Promise<void>;
        get(req: Request, res: Response): Promise<void>;
        add(req: Request, res: Response): Promise<void>;
        delete(req: Request, res: Response): Promise<void>;
        update(req: Request, res: Response): Promise<void>;

    }
}

export = Route;
