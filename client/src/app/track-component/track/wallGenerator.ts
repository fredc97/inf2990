import { BoxGeometry, Line, Geometry, LineBasicMaterial } from "three";

const INSIDE_WALL: string = "inside wall";
const OUTSIDE_WALL: string = "outside wall";
const TROIS: number = 3;
export class WallGenerator {
    private geometries: BoxGeometry[];
    private positionsWall: Line[];
    private lines: Geometry[];

    public constructor(geometries: BoxGeometry[]) {
        this.geometries = geometries;
        this.positionsWall = [];
        this.lines = [];
    }
    public generateWall(): Line[] {
        this.generateOutsideWall();
        this.generateInsideWall();

        return this.positionsWall;
    }
    private generateOutsideWall(): void {
        for (const geometries of this.geometries) {
            const lineGeo: Geometry = new Geometry();
            lineGeo.vertices[0] = geometries.vertices[1];
            lineGeo.vertices[1] = geometries.vertices[TROIS];
            lineGeo.computeBoundingBox();
            this.lines.push(lineGeo);
            const line: Line = new Line(lineGeo, new LineBasicMaterial());
            line.name = OUTSIDE_WALL;
            this.positionsWall.push(line);
            }
    }
    private generateInsideWall(): void {
        for (const geometries of this.geometries) {
            const lineGeo: Geometry = new Geometry();
            lineGeo.vertices[0] = geometries.vertices[0];
            lineGeo.vertices[1] =  geometries.vertices[2];
            lineGeo.computeBoundingBox();
            this.lines.push(lineGeo);
            const line: Line = new Line(lineGeo, new LineBasicMaterial());
            line.name = INSIDE_WALL;
            this.positionsWall.push(line);
            }
    }
    public getLines(): Geometry[] {
        return this.lines;
    }
}
