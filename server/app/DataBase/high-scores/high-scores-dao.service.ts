import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import HighScoresModel from "./high-scores.model";
import * as mongoose from "mongoose";
import { DAO } from "../dao";
import { SUCCESS, ERROR } from "../../../../common/data-access-object-constants";

module Route {

    @injectable()
    export class HighScoresDAOService implements DAO {
        public async getAll(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").find().then((highScores: mongoose.Document[]) => {
                res.send(JSON.stringify(highScores));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async get(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").findById(req.params.id).then((highScore: mongoose.Document) => {
                res.send(JSON.stringify(highScore));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async getByTrackId(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").find().sort({ time: 1 }).where("idTrack").equals(req.params.id)
                .then((highScores: mongoose.Document[]) => {
                    res.send(JSON.stringify(highScores));
                }).catch((err: string) => {
                    console.error(err);
                });
        }

        public async getLastHighScoreId(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").findOne().sort({ field: "asc", _id: -1 }).then((highScore: mongoose.Document) => {
                res.send(JSON.stringify(highScore._id));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async add(req: Request, res: Response): Promise<void> {
            const newHighScore: mongoose.Document = new HighScoresModel({
                name: req.body.highScore.name,
                time: req.body.highScore.time,
                idTrack: req.body.highScore.idTrack
            });
            newHighScore.save((err: boolean) => {
                if (err) {
                    res.send(JSON.stringify(ERROR));
                } else {
                    res.send(JSON.stringify(SUCCESS));
                }
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async delete(req: Request, res: Response): Promise<void> {
            const highScore: mongoose.Document = new HighScoresModel({
                _id: req.params.id
            });
            highScore.remove((err: boolean) => {
                if (err) {
                    res.send(JSON.stringify(ERROR));
                } else {
                    res.send(JSON.stringify(SUCCESS));
                }
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async deleteAllByTrackId(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").deleteMany({ "idTrack": req.params.id }).then((repos: void) => {
                res.send(JSON.stringify(SUCCESS));
            }).catch((err: boolean) => {
                res.send(JSON.stringify(ERROR));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async update(req: Request, res: Response): Promise<void> {
            mongoose.model("highScores").findById(req.body.highScores.id).then((highScore: mongoose.Document) => {
                highScore.set("name", req.body.highScore.name);
                highScore.set("time", req.body.highScore.time);
                highScore.save((err: boolean) => {
                    if (err) {
                        res.send(JSON.stringify(ERROR));
                    } else {
                        res.send(JSON.stringify(SUCCESS));
                    }
                }).catch((err: string) => {
                    console.error(err);
                });
            }).catch((err: string) => {
                console.error(err);
            });
        }

    }
}

export = Route;
