import { EventHandlerService } from "../event-handler.service";
import { Car } from "./car";

const ACCELERATE_KEYCODE: number = 87;  // w
const LEFT_KEYCODE: number = 65;        // a
const BRAKE_KEYCODE: number = 83;       // s
const RIGHT_KEYCODE: number = 68;       // d

export class CarController {

    private controlledCar: Car;
    public constructor(private eventHandler: EventHandlerService, car: Car) {
        this.controlledCar = car;
    }

    public init(): void {
        this.initKeyUp();
        this.initKeyDown();
    }

    private initKeyDown(): void {
        this.eventHandler.keyDownRegister.set(ACCELERATE_KEYCODE, () => this.controlledCar.isAcceleratorPressed = true);
        this.eventHandler.keyDownRegister.set(BRAKE_KEYCODE, () => this.controlledCar.brake());
        this.eventHandler.keyDownRegister.set(LEFT_KEYCODE, () => this.controlledCar.steerLeft());
        this.eventHandler.keyDownRegister.set(RIGHT_KEYCODE, () => this.controlledCar.steerRight());

    }

    private initKeyUp(): void {
        this.eventHandler.keyUpRegister.set(ACCELERATE_KEYCODE, () => this.controlledCar.isAcceleratorPressed = false);
        this.eventHandler.keyUpRegister.set(BRAKE_KEYCODE, () => this.controlledCar.releaseBrakes());
        this.eventHandler.keyUpRegister.set(LEFT_KEYCODE, () => this.controlledCar.releaseSteering());
        this.eventHandler.keyUpRegister.set(RIGHT_KEYCODE, () => this.controlledCar.releaseSteering());
    }

}
