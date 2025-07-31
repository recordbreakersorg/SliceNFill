import Color from "./color";
import { AskOpenImages, GetEditors } from "../../wailsjs/go/backend/App";
import { editor } from "../../wailsjs/go/models";

type EditorParams = {
  colors: {
    primary: Color[];
    secondary: Color[];
  };
};

export default class Editor {
  id: number;
  file: string;
  params: EditorParams;
  stack: ImageInfo[];
  stackIndex: number;
  static async getEditors(): Promise<Editor[]> {
    return GetEditors().then((editors) => editors.map(Editor.fromGO));
  }
  static async askOpenFiles() {
    return (await AskOpenImages()).map((rawEditor) => {
      return Editor.fromGO(rawEditor);
    });
  }
  static fromGO(go: editor.Editor) {
    return new Editor({
      file: go.File,
      id: go.ID,
      params: {
        colors: {
          primary: [],
          secondary: [],
        },
      },
      stack: [],
      stackIndex: 0,
    });
  }
  constructor({
    file,
    id,
    stack,
    stackIndex,
    params,
  }: {
    file: string;
    id: number;
    params: EditorParams;
    stack: ImageInfo[];
    stackIndex: number;
  }) {
    this.file = file;
    this.id = id;
    this.params = params;
    this.stack = stack;
    this.stackIndex = stackIndex;
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
