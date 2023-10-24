import { TestBed, inject } from "@angular/core/testing";
import { IdService } from "./id.service";
import { WordInterface } from "../../../../../common/interfaces/word-interface";
import { LetterInterface } from "../../../../../common/interfaces/letter-interface";

// tslint:disable:no-magic-numbers

describe("IdService", () => {
    const idService: IdService = new IdService();
    const letter1: LetterInterface = {
        _character: "m",
        _row: 0,
        _col: 0,
        _order: 1,
        _isBlank: false,
    };
    const letter2: LetterInterface = {
        _character: "o",
        _row: 0,
        _col: 1,
        _order: 1,
        _isBlank: false,
    };
    const letter3: LetterInterface = {
        _character: "m",
        _row: 0,
        _col: 2,
        _order: 1,
        _isBlank: false,
    };
    const word: WordInterface = {
        _index: 1,
        _isHorizontal: true,
        _letters: [letter1, letter2, letter3],
        _order: 1,
        _definition: "mother",
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [IdService]
        });
    });

    it("should be created", inject([IdService], (service: IdService) => {
        expect(service).toBeTruthy();
    }));
    it("should get the first and the last id", () => {
        expect(idService.obtainLimitIds(word)[0]).toBe("0");
        expect(idService.obtainLimitIds(word)[1]).toBe("2");
    });
    it("should obtain the wordLength", () => {
        expect(idService.obtainCurrentLength(word)).toBe(3);
    });
    it("should set the currentOrder", () => {
        idService.currentOrder = 5;
        expect(idService.currentOrder).toBe(5);
    });
    it("should get the currentOrder", () => {
        expect(idService.currentOrder).toBe(5);
    });
    it("should find if we are in the last order", () => {
        expect(idService.isOrderMax(word)).toBe(false);
    });
});
