import { LetterInterface } from "./letter-interface";

export interface WordInterface {
    _index: number;
    _isHorizontal: boolean;
    _letters: LetterInterface[];
    _order: number;
    _definition: string;
}
