import { GridService } from "../grid/grid.service";
import { ReflectiveInjector } from "@angular/core";
import { async, fakeAsync, TestBed } from "@angular/core/testing";
import { BaseRequestOptions, ConnectionBackend, Http, RequestOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { GridInterface } from "../../../../../common/interfaces/grid-interface";
/* tslint:disable: no-magic-numbers */
const FAKE_GRID: GridInterface = {
    _words: [],
    _letters: [],
    _difficulty: 0
};
describe("GridService", () => {
    const injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([
        { provide: ConnectionBackend, useClass: MockBackend },
        { provide: RequestOptions, useClass: BaseRequestOptions },
        Http, GridService,
    ]);

    const gridService: GridService = injector.get(GridService);
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [GridService]
        }).compileComponents().catch((err) => {
            console.error(err);
        });
    }));
    it("should get the grid correctly", fakeAsync(() => {
        let grid: GridInterface = FAKE_GRID;
        const difficulty: number = 1;
        gridService.get(difficulty).then((gridModel: GridInterface) => grid = gridModel).catch((err) => {
            console.error(err);
            expect(grid._words.length).toEqual(20);
            expect(grid._letters.length).toEqual(10);
            expect(grid._difficulty).toEqual(difficulty);
        });
    }));
});
