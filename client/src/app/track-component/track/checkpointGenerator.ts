import { Vector3, BoxGeometry, Mesh } from "three";
import {VERTICES_3, VERTICES_4, VERTICES_5, VERTICES_6, VERTICES_7} from "../../constants/track-constants";
const PADDING: number = 5;
const PADDING_CHECKPOINT: number = 15;
export const CHECKPOINT_NAME: string = "checkPoint";
export const ARRIVAL_POINT_NAME: string = "arrival";

export class CheckpointGenerator {

    public constructor() {
    }
    public generateCheckPoint(points: Vector3[], geometries: BoxGeometry[], index: number): Mesh {
        const recGeo: BoxGeometry = new BoxGeometry(PADDING, PADDING, PADDING);
        recGeo.vertices[0] = geometries[index].vertices[0].clone();
        recGeo.vertices[1] = geometries[index].vertices[0].clone().add(new Vector3(PADDING_CHECKPOINT, 0, PADDING_CHECKPOINT));
        recGeo.vertices[2] = geometries[index].vertices[1].clone().add(new Vector3(PADDING_CHECKPOINT, 0, PADDING_CHECKPOINT));
        recGeo.vertices[VERTICES_3] = geometries[index].vertices[1].clone();
        recGeo.vertices[VERTICES_7] = geometries[index].vertices[0].clone().add(new Vector3(0, PADDING_CHECKPOINT, 0));
        recGeo.vertices[VERTICES_6] = geometries[index].vertices[0].clone().add(
            new Vector3(PADDING_CHECKPOINT, PADDING_CHECKPOINT, PADDING_CHECKPOINT));
        recGeo.vertices[VERTICES_5] = geometries[index].vertices[1].clone().add(
            new Vector3(PADDING_CHECKPOINT, PADDING_CHECKPOINT, PADDING_CHECKPOINT));
        recGeo.vertices[VERTICES_4] = geometries[index].vertices[1].clone().add(new Vector3(0, PADDING_CHECKPOINT, 0));
        const rec: Mesh = new Mesh(recGeo);
        rec.visible = false;
        if (index === 0) {
            rec.name = ARRIVAL_POINT_NAME;
        } else {
            rec.name = CHECKPOINT_NAME;
        }

        return rec;
    }
}
