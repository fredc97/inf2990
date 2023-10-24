import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh, Scene, TextureLoader } from "three";

const PADDING: number = 5;
const HEIGHT_WIDTH: number = 2;
const PATH_TEXTURE: string = "../../assets/route2.jpg";
const ASSET_SOL: string = "../../assets/sol.jpg";
const SIZE_PLANE: number = 36000;
const HEIGHT_PLANE: number = -0.5;
const VERTICE_THREE: number = 3;
const PLAN_TEXTURE_NAME: string = "Plan texture";
const TRACK_TEXTURE_NAME: string = "track texture";

export class TrackGenerator {
    private geometries: BoxGeometry[];

    public constructor(geometries: BoxGeometry[]) {
        this.geometries = geometries;
    }

    public generateTrack(points: Vector3[], scale: number): Mesh[] {
        const tab: Mesh[] = new Array<Mesh>();
        for (let i: number = 0; i < points.length; i++) {
            const recGeo: BoxGeometry = new BoxGeometry(HEIGHT_WIDTH, 0, HEIGHT_WIDTH);
            this.generateTrackHeight(recGeo, i, points);
            if (i < points.length - 1) {
                this.generateTrackWidth(recGeo, i, points);
            }

            if (i === points.length - 1) {
                this.generateEndTrack(recGeo, points);
            }
            const recMat: MeshBasicMaterial = new MeshBasicMaterial({ map: new TextureLoader().load(PATH_TEXTURE) });
            const rec: Mesh = new Mesh(recGeo, recMat);
            rec.geometry.name = TRACK_TEXTURE_NAME;
            rec.geometry.scale(scale, 1, scale);
            this.geometries.push(recGeo);
            tab.push(rec);
        }

        return tab;
    }

    private generateEndTrack(recGeo: BoxGeometry, points: Vector3[]): void {
        recGeo.vertices[2].x = points[0].x;
        recGeo.vertices[2].z = points[0].z;
        if (points[0].x > 0) {
            recGeo.vertices[VERTICE_THREE].x = points[0].x + PADDING;
        }
        if (points[0].x < 0) {
            recGeo.vertices[VERTICE_THREE].x = points[0].x - PADDING;
        }
        if (points[0].z > 0) {
            recGeo.vertices[VERTICE_THREE].z = points[0].z + PADDING;
        }
        if (points[0].z < 0) {
            recGeo.vertices[VERTICE_THREE].z = points[0].z - PADDING;
        }
    }
    private generateTrackHeight(recGeo: BoxGeometry, index: number, points: Vector3[]): void {
        recGeo.vertices[0].x = points[index].x;
        recGeo.vertices[0].z = points[index].z;
        if ( points[index].x > 0) {
           recGeo.vertices[1].x = points[index].x + PADDING;
        }
        if  (points[index].x < 0) {
           recGeo.vertices[1].x = points[index].x - PADDING;
        }
        if ( points[index].z > 0) {
           recGeo.vertices[1].z = points[index].z + PADDING;
        }
        if (points[index].z < 0) {
           recGeo.vertices[1].z = points[index].z - PADDING;
        }
    }
    private generateTrackWidth(recGeo: BoxGeometry, index: number, points: Vector3[]): void {
        recGeo.vertices[2].x = points[index + 1].x;
        recGeo.vertices[2].z = points[index + 1].z;

        if (points[index + 1].x > 0) {
            recGeo.vertices[VERTICE_THREE].x = points[index + 1].x + PADDING;
        }
        if (points[index + 1].x < 0) {
            recGeo.vertices[VERTICE_THREE].x = points[index + 1].x - PADDING;
        }
        if (points[index + 1].z > 0) {
            recGeo.vertices[VERTICE_THREE].z = points[index + 1].z + PADDING;
        }
        if (points[index + 1].z < 0) {
            recGeo.vertices[VERTICE_THREE].z = points[index + 1].z - PADDING;
        }
    }

    public getGeometries(): BoxGeometry[] {
        return this.geometries;
    }

    public generatePlane(scene: Scene): Mesh {
        const geometry: BoxGeometry = new BoxGeometry( SIZE_PLANE, HEIGHT_PLANE, SIZE_PLANE);
        const material: MeshBasicMaterial = new MeshBasicMaterial( {map: new TextureLoader().load(ASSET_SOL)} );
        const plane: Mesh = new Mesh( geometry, material );
        plane.geometry.name = PLAN_TEXTURE_NAME;
        scene.add( plane );

        return plane;
    }
}
