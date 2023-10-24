import { Vector3, BoxGeometry } from "three";
import { Player } from "../../racing-game/player";

const POSITION_CAR: number = 5;

export class CarGenerator {

    private geometries: BoxGeometry[];

    public constructor(geometries: BoxGeometry[]) {
        this.geometries = geometries;
    }

    public generateCars(players: Player[]): void {
        const tablePosition: Vector3[] = this.generatePositions(POSITION_CAR, POSITION_CAR);
        const tableRandomPosition: Vector3[] = this.shuffleCarPositions(tablePosition);
        for (let i: number = 0; i <= players.length - 1; i++) {
          players[i].getCar().getMesh().position.set(tableRandomPosition[i].x, tableRandomPosition[i].y, tableRandomPosition[i].z);
          players[i].getCar().getMesh().rotation.y = - Math.PI;
        }
    }
    private generatePositions(coefficientX: number, coefficientY: number): Vector3[] {
        const tablePositionCar: Vector3[] = new Array<Vector3>();
        tablePositionCar.push(this.generatePosition(coefficientX, coefficientY));
        tablePositionCar.push(this.generatePosition(-coefficientX, coefficientY));
        tablePositionCar.push(this.generatePosition(coefficientX, -coefficientY));
        tablePositionCar.push(this.generatePosition(-coefficientX, -coefficientY));

        return tablePositionCar;
    }

    private getFirstVertice(): Vector3 {
        const point: Vector3 = new Vector3();
        if (this.geometries.length !== 0) {
            point.x = (this.geometries[0].vertices[0].x + this.geometries[0].vertices[1].x) / 2;
            point.y = (this.geometries[0].vertices[0].y + this.geometries[0].vertices[1].y) / 2;
            point.z = (this.geometries[0].vertices[0].z + this.geometries[0].vertices[1].z) / 2;
        }

        return point;

    }
    private generatePosition(coefficientX: number, coefficientY: number): Vector3 {
        const position: Vector3 = new Vector3();
        if (this.geometries.length !== 0) {
            position.x = this.getFirstVertice().x + coefficientX;
            position.y = this.getFirstVertice().y;
            position.z = this.getFirstVertice().z + coefficientY;
            position.angleTo(new Vector3(2, 2, 2));
        }

        return position;
    }

    public shuffleCarPositions(carPositions: Vector3[]): Vector3[] {
        return carPositions.sort((a: Vector3, b: Vector3) => Math.random() * 2 - 1);
    }

}
