import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Response } from "@angular/http/src/static_response";
import { HighScoreModel } from "./high-score-model";
import { DAO } from "./dao";
import {
    HIGHSCORE_CRUD_URL, ADD, GET, UPDATE, GET_ALL, DELETE, GET_BY_TRACK_ID,
    DELETE_ALL_BY_TRACK_ID
} from "../../../../common/data-access-object-constants";

@Injectable()
export class HighScoreDaoService implements DAO {

    public constructor(private http: Http) { }

    public async add(highScore: HighScoreModel): Promise<string> {
        return this.http.post(HIGHSCORE_CRUD_URL + ADD, { highScore }).
            toPromise().then((res: Response) => {
                return res.json();
            });
    }

    public async update(highScore: HighScoreModel): Promise<string> {
        return this.http.put(HIGHSCORE_CRUD_URL + UPDATE, { highScore }).
            toPromise().then((res: Response) => {
                return res.json();
            });
    }

    public async getAll(): Promise<string[]> {
        return this.http.get(HIGHSCORE_CRUD_URL + GET_ALL).toPromise().then((res: Response) => {
            return res.json();
        });
    }

    public async getByTrackId(id: string): Promise<HighScoreModel[]> {
        return this.http.get(HIGHSCORE_CRUD_URL + GET_BY_TRACK_ID + id).toPromise().then((res: Response) => {
            const highScores: HighScoreModel[] = [];
            for (let i: number = 0; i < res.json().length; i++) {
                const highScore: HighScoreModel = {
                    id: res.json()[i]._id,
                    name: res.json()[i].name,
                    time: new Date(res.json()[i].time),
                    idTrack: res.json()[i].id_track
                };
                highScores.push(highScore);
            }

            return highScores;
        });
    }

    public async get(id: string): Promise<HighScoreModel> {
        return this.http.get(HIGHSCORE_CRUD_URL + GET + id).toPromise().then((res: Response) => {
            return {
                id: res.json()._id,
                name: res.json().name,
                time: res.json().time,
                idTrack: res.json().id_track
            };
        });
    }

    public async delete(id: string): Promise<string> {
        return this.http.delete(HIGHSCORE_CRUD_URL + DELETE + id).toPromise().then((res: Response) => {
            return res.json();
        });
    }

    public async deleteAllByTrackId(id: string): Promise<string> {
        return this.http.delete(HIGHSCORE_CRUD_URL + DELETE_ALL_BY_TRACK_ID + id).toPromise().then((res: Response) => {
            return res.json();
        });
    }

}
