import Color from "./color";

export default class Editor {
  id: number;
  file: string;
  params: {
    colors: {
      primary: Color[];
      secondary: Color[];
    };
  };
  stack: ImageInfo[];
  stackIndex: number;
  static async getEditors(): Promise<Editor[]> {
    return [];
  }
  constructor({
    file,
    id,
    image,
  }: {
    file: string;
    id: number;
    image: ImageInfo;
  }) {
    this.file = file;
    this.id = id;
    this.params = {
      colors: {
        primary: [],
        secondary: [],
      },
    };
    this.stack = [image];
    this.stackIndex = 0;
  }
}

export class ImageInfo {
  id: number;
  width: number;
  height: number;
  constructor({
    id,
    width,
    height,
  }: {
    id: number;
    width: number;
    height: number;
  }) {
    this.id = id;
    this.width = width;
    this.height = height;
  }
}
