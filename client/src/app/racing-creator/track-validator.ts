import { Vector3 } from "three";
import { Point } from "./point";

const MINIMAL_POINTS_TO_GET_SEGMENT: number = 2;
const MINIMAL_POINTS_TO_GET_ANGLE: number = 3;
const MINIMAL_POINTS_TO_GET_INTERSECTION: number = 4;
const MINIMAL_ACCEPTABLE_ANGLE: number = 45;
const A_POINT: number = 0;
const B_POINT: number = 1;
const C_POINT: number = 2;
const D_POINT: number = 3;
const SEMICIRCLE_DEGREE: number = 180;
const DIV_ERROR: string = "division par 0";

export class TrackValidator {
    private points: Point[];
    public constructor(points: Point[]) {
        this.points = points;
    }

    public validateLength(modifiedPoint: Point, width: number): boolean {
        if (this.points.length < MINIMAL_POINTS_TO_GET_SEGMENT) {
            return true;
        }

        let index: number = this.points.indexOf(modifiedPoint);
        let segmentsCount: number = 1;

        if (index === 0) {
            index++;
        } else if (index !== this.points.length - 1) {
            segmentsCount = 2;
        }

        for (let i: number = 0; i < segmentsCount; i++) {
            const height: number = this.points[index].getPoint().position.distanceTo(this.points[index - 1].getPoint().position);
            if (height < (width * 2)) {
                return false;
            }
            index++;
        }

        return true;
    }

    public validateAngle(modifiedPoint: Point): boolean {
        if (this.points.length < MINIMAL_POINTS_TO_GET_ANGLE) {
            return true;
        }

        let middlePointIndex: number = this.points.indexOf(modifiedPoint);
        if (middlePointIndex === 0) {
            middlePointIndex++;
        } else if (middlePointIndex === this.points.length - 1) {
            middlePointIndex--;
        }

        const pointA: Vector3 = this.points[middlePointIndex - 1].getPoint().position;
        const pointB: Vector3 = this.points[middlePointIndex].getPoint().position;
        const pointC: Vector3 = this.points[middlePointIndex + 1].getPoint().position;

        const distanceAB: number = pointA.distanceTo(pointB);
        const distanceAC: number = pointA.distanceTo(pointC);
        const distanceBC: number = pointB.distanceTo(pointC);

        if (distanceAB * distanceBC === 0) {
            console.error(DIV_ERROR);

            return false;
        }

        const angleB: number = Math.round(Math.acos((Math.pow(distanceAB, 2) + Math.pow(distanceBC, 2) - Math.pow(distanceAC, 2))
            / (distanceAB * distanceBC * 2)) * SEMICIRCLE_DEGREE / Math.PI);

        return angleB >= MINIMAL_ACCEPTABLE_ANGLE;
    }

    public validateSegment(modifiedPoint: Point): boolean {
        if (this.points.length < MINIMAL_POINTS_TO_GET_INTERSECTION) {
            return true;
        }

        let index: number = this.points.indexOf(modifiedPoint);
        let start: number = 0;

        if (this.points.indexOf(modifiedPoint) === 0) {
            index = 1;
            start = index + 1;
        }

        for (let i: number = start; i < this.points.length - 1; i++) {
            const lines: Vector3[] = this.linesToCompare(index, i);
            const inversedLines: Vector3[] = this.linesToCompare(index, i).reverse();

            if (this.intersection(lines) && this.intersection(inversedLines)) {
                return false;
            }

            if (i === index - MINIMAL_POINTS_TO_GET_ANGLE) {
                index++;
                i = index + 1;
            }
        }

        return true;
    }

    public intersection(lines: Vector3[]): boolean {
        lines[B_POINT].sub(lines[A_POINT]);
        lines[C_POINT].sub(lines[A_POINT]);
        lines[D_POINT].sub(lines[A_POINT]);
        const factorBC: number = (lines[B_POINT].x * lines[C_POINT].z) - (lines[B_POINT].z * lines[C_POINT].x);
        const factorBD: number = (lines[B_POINT].x * lines[D_POINT].z) - (lines[B_POINT].z * lines[D_POINT].x);

        return ((factorBC < 0 && factorBD > 0) || (factorBC > 0 && factorBD < 0));
    }

    private linesToCompare(firstLinePoint: number, secondLinePoint: number): Vector3[] {
        const lines: Vector3[] = [];

        lines.push(this.points[firstLinePoint].getPoint().position.clone());
        lines.push(this.points[firstLinePoint - 1].getPoint().position.clone());
        lines.push(this.points[secondLinePoint].getPoint().position.clone());
        lines.push(this.points[secondLinePoint + 1].getPoint().position.clone());

        return lines;
    }

}
