import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { Response } from "@angular/http/src/static_response";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";

const GRID_URL: string = "http://localhost:3000/grid/";

@Injectable()
export class GridService {
    public constructor(private http: Http) { }
    public async get(difficulty: number): Promise<GridInterface> {
        return this.http.get(GRID_URL + difficulty).toPromise().then((res: Response) => {
            return {
                _words: res.json()._words,
                _letters: res.json()._letters,
                _difficulty: res.json()._difficulty
            };
        });
    }
}
