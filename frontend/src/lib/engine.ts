import Img from "./img";
import { CreateEngine, DestroyEngine, GetEngineByFileName, GetEngines } from "./wailsjs/go/backend/App";
import { backend } from "./wailsjs/go/models";
export default class Engine {
  id: number;
  file: string;
  image: Img;
  constructor(id: number, path: string, image: Img) {
    this.id = id;
    this.file = path;
    this.image = image;
  }
  async destroy(): Promise<void> {
    await DestroyEngine(this.id);
  }
  static fromInfo(info: backend.EngineInfo): Engine {
    return new Engine(info.id, info.engine.FilePath, Img.fromGO(info.engine.Image));
  }
  static async getByFileName(fileName: string): Promise<Engine | null> {
    let info = await GetEngineByFileName(fileName)
    if (info.error) {
      throw new Error(info.error);
    } if (info.exists) {
      return Engine.fromInfo(info);
    } else {
      return null;
    }
  }
  static async create(filepath: string): Promise<Engine> {
    console.log("Creating engine");
    let response: backend.CreateEngineResponse = await CreateEngine(filepath)
    console.log("Engine created", response);
    if (response.error) {
      throw new Error(response.error);
    } else {
      return Engine.fromInfo(response.engine);
    }
  }
  static async getEngines(): Promise<Engine[]> {
    let infos: backend.EngineInfo[] = await GetEngines();
    console.error("Got engines info", infos)
    return infos.map(Engine.fromInfo);
  }
}

