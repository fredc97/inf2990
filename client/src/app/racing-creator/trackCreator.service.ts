import { Injectable } from "@angular/core";
import { Vector3,
    Raycaster, Projector, Intersection, LineBasicMaterial, Geometry, Points, Line, Scene } from "three";
import { Track } from "./track";
import { TrackValidator } from "./track-validator";
import { SceneCreation } from "./sceneCreation";
import { Point } from "./point";

const INVALID: string = "invalid";
const TAB_POSITION: number = 2;
const RED: number = 0xFF0000;
const RIGHT_CLICK: number = 2;
const LEFT_CLICK: number = 0;
const PIXEL_MOUSE: number = 2;
const WHITE: number = 0xFFFFFF;

@Injectable()
export class TrackCreatorService {
    private container: HTMLDivElement;
    private mouseVector: Vector3;
    private _track: Track;
    public vectors: Vector3[];
    private loadTrack: boolean;
    private trackIsDone: boolean;
    private trackValidator: TrackValidator;
    private sceneCreation: SceneCreation;

    public constructor() {
        this._track = new Track();
        this.vectors = [];
        this.trackIsDone = false;
        this.loadTrack = false;
        this.trackValidator = new TrackValidator(this._track.getPoints());
        this.sceneCreation = new SceneCreation();
    }

    public setTrack( vect: Vector3[]): void {
        this.vectors = vect;
        this.loadTrack = true;
    }
    public async initialize(container: HTMLDivElement): Promise<void> {
        if (container) {
            this.container = container;
        }
        await this.sceneCreation.createScene(this.container, this._track);
    }
    public initMouse(event: MouseEvent): Vector3 {
        this.mouseVector = new Vector3();
        const rect: ClientRect = this.sceneCreation.getRenderer().domElement.getBoundingClientRect();
        this.mouseVector.x = ((event.clientX - rect.left) / (rect.width - rect.left)) * PIXEL_MOUSE - 1;
        this.mouseVector.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * PIXEL_MOUSE + 1;

        return this.mouseVector;
    }

    public onMouseDown(event: MouseEvent): void {
        const scene: Scene = this.sceneCreation.getScene();
        switch (event.button) {
            case LEFT_CLICK:
                this.mouseVector = this.initMouse(event);
                if (this.loadTrack) {
                    this._track.drawTrack(this.mouseVector, scene, this.sceneCreation.getCamera(), this.vectors);
                    this.loadTrack = false;
                   } else {
                   this._track.drawPoint(this.mouseVector, scene, this.sceneCreation.getCamera());
                   }
                this.validateSegment();
                break;
            default:
                break;
        }
    }

    public onMouseUp(event: MouseEvent): void {
        switch (event.button) {
            case LEFT_CLICK:
                   this.leftClick(event);
                   break;

            case RIGHT_CLICK:
                    this.rightClick(event);
                    this._track.setIsFinished(false);
                    break;
            default:
                break;

        }

    }
    private validateSegment(): void {
        const linesTrack: Line[] = this._track.getTabLine();
        const pointsTrack: Point[] = this._track.getPoints();
        if (!(this.trackValidator.validateAngle(pointsTrack[pointsTrack.length - 1]))) {
            linesTrack[linesTrack.length - 1].material = new LineBasicMaterial({color: RED});
        }
        if (!(this.trackValidator.validateSegment(pointsTrack[pointsTrack.length - 1]))) {
            linesTrack[linesTrack.length - 1].material = new LineBasicMaterial({color: RED});
        }
    }
    public leftClick(event: MouseEvent): void {
        const ray: Raycaster = this.initRay(event);
        const intersects: Intersection[] = ray.intersectObject(this._track.addPlan());
        if (intersects.length) {
            const point: Points = this._track.isdragged().getPoint();
            if (this.updatePointPosition(point, intersects) && !this._track.getIsFinished()) {
                if (this._track.getPoints().length >= TAB_POSITION) {
                    this.reDrawLine(point, intersects);
                    }
                }
            if (this.updatePointPosition(point, intersects) && this.trackIsDone ) {
                if (this._track.getPoints().length >= TAB_POSITION) {
                    this.reDrawLine(point, intersects);
                }
            }
            if (this._track.getIsFinished()) {
                this.trackIsDone = true;
            }
        }
    }
    public reDrawLine(point: Points, intersects: Intersection[]): void {
        if (this.updatePointPosition(point, intersects)) {
            const line: Geometry = this._track.draggedLine();
            const line2: Geometry = this._track.draggedLine2();
            line.verticesNeedUpdate = true;
            line.vertices[1].setX(point.position.x);
            line.vertices[1].setY(point.position.y);
            line.vertices[1].setZ(point.position.z);
            line2.verticesNeedUpdate = true;
            line2.vertices[0].setX(point.position.x);
            line2.vertices[0].setY(point.position.y);
            line2.vertices[0].setZ(point.position.z);
        }
    }
    public updatePointPosition(point: Points, intersects: Intersection[]): boolean {
        let hasMoved: boolean = false;
        if (this._track.isDragged) {
            point.position.x = intersects[0].point.x;
            point.position.y = intersects[0].point.y;
            point.position.z = intersects[0].point.z;
            this.validateTrack();
            hasMoved = true;
        }

        return hasMoved;
    }
    private initRay(event: MouseEvent): Raycaster {
        const projector: Projector = new Projector();
        this.mouseVector = this.initMouse(event);
        projector.unprojectVector(this.mouseVector, this.sceneCreation.getCamera());
        const direction: Vector3 = this.mouseVector.sub(this.sceneCreation.getCamera().position).normalize();

        return new Raycaster(this.sceneCreation.getCamera().position, direction);
    }

    private validateTrack(): void {
        const linesTrack: Line[] = this._track.getTabLine();
        for (let i: number = 0; i < linesTrack.length; i++) {
            if (!(this.trackValidator.validateAngle(this._track.getPoints()[i]))) {
                linesTrack[i].material = new LineBasicMaterial({color: RED});
                linesTrack[linesTrack.length - 1].name = INVALID;
            } else {
                linesTrack[i].material = new LineBasicMaterial({color: WHITE});
                linesTrack[linesTrack.length - 1].name = "";
            }
        }
   }

    public rightClick(evebt: MouseEvent): void {
        const scene: Scene = this.sceneCreation.getScene();
        if (this._track.getIsFinished()) {
            scene.remove(scene.children[scene.children.length - 1]);
            this.clearTables();
            this.trackIsDone = false;
        } else {
            this.deletePoint();
            this.clearTables();
            scene.remove(scene.children[scene.children.length - 1]);
        }
    }
    private deletePoint(): void {
        const scene: Scene = this.sceneCreation.getScene();
        scene.remove(scene.children[scene.children.length - 1]);
        this._track.getPoints().pop();
    }
    public getTab(): Vector3[] {
        if ( this._track.getIsFinished) {
            const vect: Vector3[] = [];
            for (let i: number = 0 ; i <= this._track.getPoints().length - 1; i++) {
                const point: Vector3 = this._track.getPoints()[i].getPoint().position;
                vect.push(new Vector3(point.x, point.y, point.z));
            }

            return vect;
        } else {
            return null;
        }
    }

    public getTrackState(): boolean {
        for (let i: number = 0 ; i <= this._track.getTabLine().length - 1; i++) {
            if (this._track.getTabLine()[i].name !== "") {
                return false;
            }
         }

        return this._track.getIsFinished();
    }
    public getVect(): Vector3[] {
        return this.vectors;
    }
    private clearTables(): void {
        this._track.getTabLine().pop();
        this._track.getTabLineVec().pop();
    }
}
