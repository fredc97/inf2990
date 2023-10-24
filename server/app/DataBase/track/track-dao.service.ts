import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import TrackModel from "./track.model";
import * as mongoose from "mongoose";
import { DAO } from "../dao";
import { SUCCESS, ERROR } from "../../../../common/data-access-object-constants";

module Route {

    @injectable()
    export class TrackDAOService implements DAO {
        public async getAll(req: Request, res: Response): Promise<void> {
            mongoose.model("track").find().then((tracks: mongoose.Document[]) => {
                res.send(JSON.stringify(tracks));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async get(req: Request, res: Response): Promise<void> {
            mongoose.model("track").findById(req.params.id).then((track: mongoose.Document) => {
                res.send(JSON.stringify(track));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async getLastTrackId(req: Request, res: Response): Promise<void> {
            mongoose.model("track").findOne().sort({ field: "asc", _id: -1 }).then((track: mongoose.Document) => {
                res.send(JSON.stringify(track._id));
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async add(req: Request, res: Response): Promise<void> {
            const newTrack: mongoose.Document = new TrackModel({
                name: req.body.track.name,
                description: req.body.track.description,
                type: req.body.track.type,
                timesPlayed: req.body.track.timesPlayed,
                bestTimes: req.body.track.bestTimes,
                points: req.body.track.points
            });
            newTrack.save((err: boolean) => {
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
            const track: mongoose.Document = new TrackModel({
                _id: req.params.id
            });
            track.remove((err: boolean) => {
                if (err) {
                    res.send(JSON.stringify(ERROR));
                } else {
                    res.send(JSON.stringify(SUCCESS));
                }
            }).catch((err: string) => {
                console.error(err);
            });
        }

        public async update(req: Request, res: Response): Promise<void> {
            mongoose.model("track").findById(req.body.track.id).then((track: mongoose.Document) => {
                track.set("description", req.body.track.description);
                track.set("points", req.body.track.points);
                track.set("timesPlayed", req.body.track.timesPlayed);
                track.save((err: boolean) => {
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
