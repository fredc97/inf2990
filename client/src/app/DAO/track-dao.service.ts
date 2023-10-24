import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Response } from "@angular/http/src/static_response";
import { TrackModel } from "./track-model";
import { DAO } from "./dao";
import { FAIL, TRACK_CRUD_URL, ADD, GET, UPDATE, GET_ALL, DELETE } from "../../../../common/data-access-object-constants";

// Text that doesn't start with space, doesn't finish with space and doesn't contain two successives spaces
const TEXT_CHECKER: RegExp = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;

@Injectable()
export class TrackDaoService implements DAO {

    public constructor(private http: Http) { }

    public async add(track: TrackModel): Promise<string> {
        if (!TEXT_CHECKER.test(track.name) || !TEXT_CHECKER.test(track.description)) {
            return FAIL;
        }

        return this.http.post(TRACK_CRUD_URL + ADD, { track }).
            toPromise().then((res: Response) => {
                return res.json();
            });
    }

    public async update(track: TrackModel): Promise<string> {
        if (!TEXT_CHECKER.test(track.name) || !TEXT_CHECKER.test(track.description)) {
            return FAIL;
        }

        return this.http.put(TRACK_CRUD_URL + UPDATE, { track }).
            toPromise().then((res: Response) => {
                return res.json();
            });
    }

    public async getAll(): Promise<string[]> {
        return this.http.get(TRACK_CRUD_URL + GET_ALL).toPromise().then((res: Response) => {
            return res.json();
        });
    }

    public async get(id: string): Promise<TrackModel> {
        return this.http.get(TRACK_CRUD_URL + GET + id).toPromise().then((res: Response) => {

            return {
                id: id,
                name: res.json().name,
                description: res.json().description,
                points: res.json().points,
                timesPlayed: res.json().timesPlayed
            };
        });
    }

    public async delete(id: string): Promise<string> {
        return this.http.delete(TRACK_CRUD_URL + DELETE + id).toPromise().then((res: Response) => {
            return res.json();
        });
    }

}
