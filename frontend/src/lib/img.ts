import { GetImageData } from "./wailsjs/go/app/App";
import { engine } from "./wailsjs/go/models";

export default class Image {
  data: Uint8Array | null;
  id: number;
  width: number;
  height: number;
  constructor(id: number, width: number, height: number, data: Uint8Array | null = null) {
    this.id = id;
    this.data = data;
    this.width = width;
    this.height = height;
  }
  static fromGO(img: engine.Image): Image {
    return new Image(img.ID, img.Width, img.Height);
  }
  toGO(): engine.Image {
    return new engine.Image({ ID: this.id, Width: this.width, Height: this.height });
  }
  async load(): Promise<Uint8Array> {
    // @ts-ignore
    const rawData: string = (await GetImageData(this.toGO())).data;
    const data = atob(rawData);
    this.data = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++)
      this.data[i] = data.charCodeAt(i);
    console.log(`[ts:img] Decoded from base64. First 16 bytes: ${this.data.slice(0, 16)}`);
    return this.data;
  }
  async getData(): Promise<Uint8Array> {
    console.log(this.data);
    console.log(await this.load());
    if (this.data)
      return this.data;
    else
      return await this.load();
  }
}
