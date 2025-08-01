import { GetImageData } from "../../wailsjs/go/backend/App";
import { img } from "../../wailsjs/go/models";

export default class Image {
  info: ImageInfo;
  data: Uint8Array;
  constructor({ info, data }: { info: ImageInfo; data: Uint8Array }) {
    this.info = info;
    this.data = data;
  }
}

export class ImageInfo {
  id: number;
  width: number;
  height: number;
  format: img.ImageFormat;
  _image: Image | null = null;
  static fromGO(go: img.ImageInfo): ImageInfo {
    return new ImageInfo({
      id: go.ID,
      width: go.Width,
      height: go.Height,
      format: go.Format,
    });
  }
  constructor({
    id,
    width,
    height,
    format,
  }: {
    id: number;
    width: number;
    height: number;
    format: img.ImageFormat;
  }) {
    this.id = id;
    this.width = width;
    this.height = height;
    this.format = format;
  }
  async getData(): Promise<Uint8Array> {
    // @ts-ignore -- a typescript bug
    const b64Data: string = await GetImageData(this.id);
    const data = atob(b64Data);
    const array = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) array[i] = data.charCodeAt(i);
    console.log(
      `[ts:img] Decoded from base64. First 16 bytes: ${data.slice(0, 16)}`,
    );
    return array;
  }
  async getImage(): Promise<Image> {
    if (!this._image) {
      const data = await this.getData();
      this._image = new Image({
        info: this,
        data: data,
      });
    }
    return this._image;
  }
}
