import { CubeTextureLoader, Scene, CubeTexture } from "three";
const RIGHT_SCREEN: string = "rt.png";
const LEFT_SCREEN: string = "lf.png";
const UP_SCREEN: string = "up.png";
const DOWN_SCREEN: string = "dn.png";
const BACK_SCREEN: string = "bk.png";
const FRONT_SCREEN: string = "ft.png";
const PATH_SKYBOX: string = "../../assets/skyBox/";

export class SkyboxGenerator {

    private skyBoxTexture: CubeTexture;
    public constructor() {}

    public generateSkyBox(scene: Scene): void {
        this.skyBoxTexture = new CubeTextureLoader()
            .setPath(PATH_SKYBOX)
            .load([
                RIGHT_SCREEN,
                LEFT_SCREEN,
                UP_SCREEN,
                DOWN_SCREEN,
                BACK_SCREEN,
                FRONT_SCREEN
            ]);

        if (scene !== undefined) {
            scene.background = this.skyBoxTexture;
        }
    }
    public getSkyBox(): CubeTexture {
        return this.skyBoxTexture;
    }

}
