import { Geometry, Line } from "three";

export class Lines {
    private lines: Line[];
    private geometries: Geometry[];

    public constructor() {
        this.geometries = [];
        this.lines = [];
    }
    public getTabLine(): Line[] {
        return this.lines;
    }
    public getTabLineVec(): Geometry[] {
        return this.geometries;
    }
}
