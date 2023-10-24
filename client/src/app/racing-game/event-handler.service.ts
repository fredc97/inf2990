import { Injectable } from "@angular/core";

@Injectable()
export class EventHandlerService {

    public keyDownRegister: Map<number, Function>;
    public keyUpRegister: Map<number, Function>;

    public constructor() {
        this.keyDownRegister = new Map<number, Function>();
        this.keyUpRegister = new Map<number, Function>();
    }
}
