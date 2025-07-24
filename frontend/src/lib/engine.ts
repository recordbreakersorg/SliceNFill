import { goto } from "$app/navigation";
export default class Engine {
  id: number;
  constructor(id: number) {
    this.id = id;
  }
  static async createEngine(filepath: string): Promise<Engine> {
    return new Engine(await Engine.create(filepath));
  }
  static async getOrCreate(filepath: string): Promise<number> {
    const msg: number | string = await Engine.create(filepath);
    if (typeof msg === 'string') {
      console.error(msg);
      throw new Error(msg);
    } else {
      return msg;
    }
  }
  static async getOrCreateEngine(filepath: string): Promise<Engine> {
    const id = await Engine.getOrCreate(filepath);
    return new Engine(id);
  }
  static async get(id: number): Promise<Engine | null> {
    return null;
  }
  static async create(filepath: string): Promise<number> {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(null);
      }, 100000);
    });
    return 0;
  }
}
