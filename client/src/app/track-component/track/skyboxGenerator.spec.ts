import { SkyboxGenerator } from "./skyboxGenerator";
import { Scene } from "three";

/* tslint:disable: no-magic-numbers */
describe("Skybox", () => {
    it("should be instantiated correctly using  constructor", () => {
        const skybox: SkyboxGenerator = new SkyboxGenerator();
        expect(skybox).toBeDefined();
    });
    it("should create a skybox", () => {
        const skybox: SkyboxGenerator = new SkyboxGenerator();
        const scene: Scene = new Scene;
        skybox.generateSkyBox(scene);
        expect(skybox.getSkyBox()).toBeDefined();
    });
});
