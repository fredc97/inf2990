import { Box3, Mesh, Sphere, Vector3, SphereGeometry, Object3D } from "three";

/* Every car has a Box3, 3 meshes and 3 spheres.
*  Box3 detect the first collision.
*  We added 3 spheres beacause Box3 does not support rotation. Theses spheres are placed at these car's positions: front, rear and middle.
*  The 3 meshes make it easier to update spheres positions.
*/

const SPHERES_NUMBER: number = 3;
const POSITION_FACTOR: number = 1.5;
const RADIUS_FACTOR: number = 2;

export class BoundingBox {

    private carMesh: Object3D;
    private boundingBox: Box3;
    private spheres: Mesh[];
    private boundingSpheres: Sphere[];

    public constructor() {
        this.carMesh = new Object3D();
        this.spheres = [];
        this.boundingSpheres = [];
        this.boundingBox = new Box3(new Vector3(), new Vector3());
    }

    public init(carMesh: Object3D): void {
        this.carMesh = carMesh;
        this.boundingBox.setFromObject(this.carMesh);
        const geometry: SphereGeometry = new SphereGeometry(this.boundingBox.getBoundingSphere().radius / RADIUS_FACTOR);
        for (let i: number = 0; i < SPHERES_NUMBER; i++) {
            this.spheres[i] = new Mesh(geometry);
            this.spheres[i].visible = false;
            this.boundingSpheres[i] = new Sphere(this.spheres[i].position.clone(),
                                                 this.boundingBox.getBoundingSphere().radius / RADIUS_FACTOR);
            this.carMesh.add(this.spheres[i]);
        }
        this.spheres[0].position.z = this.boundingBox.max.z * POSITION_FACTOR;
        this.spheres[2].position.z = -this.boundingBox.max.z * POSITION_FACTOR;
    }

    public update(): void {
        this.boundingBox.setFromObject(this.carMesh);
        for (let i: number = 0; i < SPHERES_NUMBER; i++) {
            this.boundingSpheres[i].center.set(this.spheres[i].getWorldPosition().x,
                                               this.spheres[i].getWorldPosition().y,
                                               this.spheres[i].getWorldPosition().z);
        }
    }

    public checkCollision(other: BoundingBox): boolean {
        if (this.boundingBox.intersectsBox(other.getBoundingBox())) {
            for (const boundingSphere of this.boundingSpheres) {
                for (const otherBoundingSphere of other.getBoundingSpheres()) {
                    if (boundingSphere.intersectsSphere(otherBoundingSphere)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    public collisionCheckPoint(other: Box3): boolean {
        if (this.boundingBox.intersectsBox(other)) {
            for (const boundingSphere of this.boundingSpheres) {
                if (boundingSphere.intersectsSphere(other.getBoundingSphere())) {
                    return true;
                }
            }
        }

        return false;
    }
    public collisionWall(other: Box3): boolean {
        if (this.boundingBox.intersectsBox(other)) {
            for (const boundingSphere of this.boundingSpheres) {
                if (boundingSphere.intersectsSphere(other.getBoundingSphere())) {
                    return true;
                }
            }
        }

        return false;
    }

    public getBoundingBox(): Box3 {
        return this.boundingBox;
    }

    public getBoundingSpheres(): Sphere[] {
        return this.boundingSpheres;
    }

}
