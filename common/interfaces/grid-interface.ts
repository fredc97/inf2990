import { WordInterface } from "./word-interface";
import { LetterInterface } from "./letter-interface";

export interface GridInterface {
    _words: WordInterface[];
    _letters: LetterInterface[][];
    _difficulty: number;
}
