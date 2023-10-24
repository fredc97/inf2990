import {
    Vector3, Geometry, LineBasicMaterial, Line, Projector, Raycaster, PerspectiveCamera,
    Scene, SphereGeometry, PointsMaterial, Intersection, Mesh, BoxGeometry, MeshBasicMaterial, Points
} from "three";
import { Point } from "./point";
import { Lines } from "./line";

const HEIGHT_PLAN: number = 10 ;
const WIDTH_PLAN: number = 57 ;
const DEPT_PLAN: number = 27;

const RADIUS: number = 0.2;
const HEIGHT_SEGMENT: number = 50;
const WIDHT_SEGMENT: number = 100;
const BLUE: number = 0xFF;
const WHITE: number = 0xFFFFFFFF;
const TAB_POSITION: number = 2;
const FIRST_POINT: string = "first point";
const PLAN_NAME: string = "plan";

export class Track {
    private isDone: boolean;
    private points: Point[];
    private line: Lines;
    private selectedLine: Geometry;
    private selectedLine2: Geometry;
    private ray: Raycaster;
    private selectedPoint: Point;
    private intersects: Intersection[];
    public isDragged: boolean;

    public constructor() {
        this.points = [];
        this.isDone = false;
        this.ray = new Raycaster();
        this.intersects = [];
        this.isDragged = false;
        this.line = new Lines();
    }

    public drawTrack(mouseVector: Vector3, scene: Scene, camera: PerspectiveCamera, tab: Vector3[]): void {
        this.initPlan(mouseVector, scene, camera);
        const length: number = tab.length;
        for (let i: number = 0; i < length; i++) {
            const pt: Point = new Point();
            this.points.push(pt);
            scene.add(pt.getPoint());
            pt.setPoint(tab[i].x, tab[i].y, tab[i].z);
            this.drawLine(scene, this.points, this.line.getTabLineVec(), this.line.getTabLine() );
            if (i === length - 1) {
              this.endTrack(scene, this.points, this.line.getTabLineVec(), this.line.getTabLine());
            }
        }
        const point: Points =  this.points[0].getPoint();
        point.geometry = new SphereGeometry(RADIUS, WIDHT_SEGMENT, HEIGHT_SEGMENT);
        point.material = new PointsMaterial({ color: BLUE });
        point.name = FIRST_POINT;
        if (!(this.intersects[0].object.name === FIRST_POINT)) {
            this.dragPoint();
        }
    }

    public drawPoint(mouseVector: Vector3, scene: Scene, camera: PerspectiveCamera): void {
        this.initPlan(mouseVector, scene, camera);
        if (!this.isDone) {
            if (this.intersects[0].object.name === PLAN_NAME) {
                this.isDragged = false;
                const pt: Point = new Point();
                this.points.push(pt);
                scene.add(pt.getPoint());
                const firstPoint: Vector3 = this.intersects[0].point;
                pt.setPoint(firstPoint.x, firstPoint.y, firstPoint.z);
                this.drawLine(scene, this.points, this.line.getTabLineVec(), this.line.getTabLine());
                const point: Points =  this.points[0].getPoint();
                point.geometry = new SphereGeometry(RADIUS, WIDHT_SEGMENT, HEIGHT_SEGMENT);
                point.material = new PointsMaterial({ color: BLUE });
                point.name = FIRST_POINT;
            } else {
                if (this.intersects[0].object.name === FIRST_POINT) {
                    this.endTrack(scene, this.points, this.line.getTabLineVec(), this.line.getTabLine());
                 } else {
                    this.dragPoint();
                    }
                }
             }  else {
             if (this.intersects[0].object.name !== PLAN_NAME) {
                this.dragPoint();
                } else {
                this.isDragged = false;
                }
            }
    }

    private initPlan(mouseVector: Vector3, scene: Scene, camera: PerspectiveCamera): void {
        this.selectedPoint = new Point();
        const projector: Projector = new Projector();
        projector.unprojectVector(mouseVector, camera);
        let direction: Vector3 = new Vector3;
        direction = mouseVector.sub(camera.position).normalize();
        this.ray = new Raycaster(camera.position, direction);
        this.intersects = this.ray.intersectObjects(scene.children);
    }

    private endTrack(scene: Scene, points: Point[], tabLineVec: Geometry[], tabLine: Line[]): void {
        if (this.intersects.length) {
           const lineMat: LineBasicMaterial = new LineBasicMaterial({
               color: WHITE
           });
           const ptLine: Geometry = new Geometry();
           const line: Line = new Line(ptLine, lineMat);
           const firstPoint: Vector3 = points[points.length - 1].getPoint().position;
           const secondPoint: Vector3 = points[0].getPoint().position;
           ptLine.vertices.push(new Vector3(firstPoint.x, firstPoint.y, firstPoint.z));
           ptLine.vertices.push(new Vector3(secondPoint.x, secondPoint.y, secondPoint.z));
           tabLineVec.push(ptLine);
           scene.add(line);
           tabLine.push(line);
           this.isDone = true;
        }
   }

    private dragPoint(): void {
        for (let index: number = 1; index < this.points.length; index++) {
            this.isDragged = true;
            this.intersects = this.ray.intersectObject(this.points[index].getPoint());
            if (this.intersects.length) {
                this.selectedPoint = this.points[index];
                this.selectedLine2 = this.getTabLineVec()[index];
                if (index > 0) {
                    this.selectedLine = this.getTabLineVec()[index - 1];
                }
            }
        }
    }

    private drawLine(scene: Scene, points: Point[], tabLineVec: Geometry[], tabLine: Line[]): void {
            const lineMat: LineBasicMaterial = new LineBasicMaterial({
                color: WHITE
            });

            const ptLine: Geometry = new Geometry();
            const line: Line = new Line(ptLine, lineMat);
            if (points.length >= TAB_POSITION) {
                const firstPoint: Vector3 = points[points.length - TAB_POSITION].getPoint().position;
                const secondPoint: Vector3 = points[points.length - 1].getPoint().position;
                ptLine.vertices.push(new Vector3(firstPoint.x, firstPoint.y, firstPoint.z));
                ptLine.vertices.push(new Vector3(secondPoint.x, secondPoint.y, secondPoint.z));
                tabLineVec.push(ptLine);
                tabLine.push(line);
                scene.add(line);
            }
        }
    public addPlan(): Mesh {
        const planGeo: BoxGeometry = new BoxGeometry(WIDTH_PLAN, HEIGHT_PLAN, DEPT_PLAN);
        const planMat: MeshBasicMaterial = new MeshBasicMaterial({
            color: BLUE, opacity: 0, transparent: true
        });
        const plan: Mesh = new Mesh(planGeo, planMat);
        plan.name = PLAN_NAME;

        return plan;
    }

    public getPoints(): Point[] {
        return this.points;
    }

    public isdragged(): Point {
        return this.selectedPoint;
    }

    public draggedLine(): Geometry {
        return this.selectedLine;
    }

    public draggedLine2(): Geometry {
        return this.selectedLine2;
    }
    public getTabLineVec(): Geometry[] {
        return this.line.getTabLineVec();
    }
    public getTabLine(): Line[] {
        return this.line.getTabLine();
    }
    public getIsFinished(): boolean {
        return this.isDone;
    }
    public setIsFinished(finished: boolean): void {
        this.isDone = finished;
    }

}
