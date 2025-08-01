import Color from "./color";
import { AskOpenImages, GetEditors } from "../../wailsjs/go/backend/App";
import { editor, options } from "../../wailsjs/go/models";
import { ImageInfo } from "./image";
import StatusManager from "./status";
import Ruse from "./ruses";
type EditorParams = {
  colors: {
    primary: Color[];
    secondary: Color[];
  };
};

let done = 0;
export default class Editor {
  id: number;
  file: string;
  params: EditorParams;
  stack: ImageInfo[];
  stackIndex: Ruse<number>;
  status: StatusManager;
  view: {
    scale: {
      x: number;
      y: number;
    };
    transtation: {
      x: number;
      y: number;
    };
    rotation: {
      x: number;
      y: number;
      z: number;
    };
  };

  static async getEditors(): Promise<Editor[]> {
    return GetEditors().then((editors: editor.EditorInfo[]) =>
      editors.map((info) => {
        return Editor.fromInfo(info);
      }),
    );
  }
  static async askOpenFiles() {
    return (await AskOpenImages()).map((rawEditor) => {
      return Editor.fromInfo(rawEditor);
    });
  }
  static fromInfo(go: editor.EditorInfo) {
    return new Editor({
      file: go.File,
      id: go.ID,
      params: {
        colors: {
          primary: (go.Params.Colors.Primary ?? []).map((color: options.RGBA) =>
            Color.fromCSS(
              `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 255})`,
            ),
          ),
          secondary: (go.Params.Colors.Secondary ?? []).map(
            (color: options.RGBA) =>
              Color.fromCSS(
                `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a * 255})`,
              ),
          ),
        },
      },
      stack: go.Stack.map(ImageInfo.fromGO),
      stackIndex: go.StackIndex,
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
    this.status = new StatusManager();
    this.file = file;
    this.id = id;
    this.params = params;
    this.stack = stack;
    this.stackIndex = new Ruse(stackIndex);
    this.view = {
      rotation: {
        x: 0,
        y: 0,
        z: 0,
      },
      scale: {
        x: 1,
        y: 1,
      },
      transtation: {
        x: 0,
        y: 0,
      },
    };
  }
}
