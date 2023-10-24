import {Points, PointsMaterial, Vector3, SphereGeometry } from "three";

const RADIUS: number = 0.4;
const HEIGHT_SEGMENT: number = 50 ;
const WIDHT_SEGMENT: number = 100 ;
const SIZE: number = 10;

export class Point {
    private dotGeometry: SphereGeometry;
    private dotMaterial: PointsMaterial;
    private dot: Points;
    public constructor() {
        this.dotGeometry = new SphereGeometry(RADIUS, WIDHT_SEGMENT, HEIGHT_SEGMENT);
        this.dotGeometry.vertices.push(new Vector3(0, 0, 0));
        this.dotMaterial = new PointsMaterial({
            size: SIZE,
            sizeAttenuation: false
        });
        this.dot = new Points(this.dotGeometry, this.dotMaterial);
    }

    public setPoint(x: number, y: number, z: number): void {
        this.dot.position.set(x, y, z);
    }

    public getPoint(): Points {
        return this.dot;
    }
}
