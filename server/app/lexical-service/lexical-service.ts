import { Request, Response } from "express";
import "reflect-metadata";
import { injectable, } from "inversify";
import * as requestPromise from "request-promise";
import { LexicalServiceResult } from "./lexical-service-result";

const COMMON_WORD: string = "common";
const UNCOMMON_WORD: string = "uncommon";
const FRQUENCY_MAX: string = "frequencyMax=3.5";
const FRQUENCY_MIN: string = "frequencyMin=3.5";
const RANDOM_OPTION: string = "?random=true";
const LENGTH_OPTION: string = "letters=";
const PATTERN_OPTION: string = "letterPattern=";
const API_URL: string = "https://wordsapiv1.p.mashape.com/words/";
const KEY_HEADER: string = "0e6lMun5qxmshfjaZ7Qz53zDcguVp17RwUWjsnK64ldap2mr36";
const HOST_HEADER: string = "wordsapiv1.p.mashape.com";

module Route {

    @injectable()
    export class LexicalService {
        private url: string;
        private method: string;
        private headers: {};

        public constructor() {
            this.url = API_URL;
            this.method = "GET";
            this.headers = {
                "X-Mashape-Key": KEY_HEADER,
                "X-Mashape-Host": HOST_HEADER
            };
        }

        private requestSetup(param: string): requestPromise.Options {
            return {
                url: this.url + param,
                method: this.method,
                headers: this.headers,
                json: true
            };
        }

        private setFrequency(wordType: string): string {
            let frequency: string;
            if (wordType === UNCOMMON_WORD) {
                frequency = FRQUENCY_MAX;
            } else if (wordType === COMMON_WORD) {
                frequency = FRQUENCY_MIN;
            }

            return frequency;
        }

        public async getWordByLength(req: Request, res: Response): Promise<void> {
            const length: string = LENGTH_OPTION + req.params.length;
            const wordType: string = req.params.frequency;
            const frequency: string = this.setFrequency(wordType);
            const reqSetup: requestPromise.Options = this.requestSetup(RANDOM_OPTION + "&" + length + "&" + frequency);
            requestPromise(reqSetup).then((repos: LexicalServiceResult) => {
                res.send(JSON.stringify(repos.word));
            });
        }

        public async getWordByLetters(req: Request, res: Response): Promise<void> {
            const letters: string = PATTERN_OPTION + req.params.letters;
            const wordType: string = req.params.frequency;
            const frequency: string = this.setFrequency(wordType);
            const reqSetup: requestPromise.Options = this.requestSetup(RANDOM_OPTION + "&" + letters + "&" + frequency);
            requestPromise(reqSetup).then((repos: LexicalServiceResult) => {
                res.send(JSON.stringify(repos.word));
            });
        }

        public async getWordByLettersAndLength(req: Request, res: Response): Promise<void> {
            const letters: string = PATTERN_OPTION + req.params.letters;
            const length: string = LENGTH_OPTION + req.params.length;
            const wordType: string = req.params.frequency;
            const frequency: string = this.setFrequency(wordType);
            const reqSetup: requestPromise.Options = this.requestSetup(RANDOM_OPTION + "&" + frequency + "&" + length + "&" + letters);
            requestPromise(reqSetup).then((repos: LexicalServiceResult) => {
                res.send(JSON.stringify(repos.word));
            });
        }

        public async getDefinitions(req: Request, res: Response): Promise<void> {
            const reqSetup: requestPromise.Options = this.requestSetup(req.params.word + "/definition");
            requestPromise(reqSetup).then((repos: LexicalServiceResult) => {
                res.send(JSON.stringify(repos.definition));
            });
        }
    }
}

export = Route;
