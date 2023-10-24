import { Object3D, ObjectLoader } from "three";

const TEXTURE_LOCATION: string = "../../assets/camero/camero-2010-low-poly.json";

export class CarTextureLoader {

    public constructor() { }

    public async load(): Promise<Object3D> {
        return new Promise<Object3D>((resolve, reject) => {
            const loader: ObjectLoader = new ObjectLoader();
            loader.load(TEXTURE_LOCATION, (object) => {
                resolve(object);
            });
        });
    }
}
