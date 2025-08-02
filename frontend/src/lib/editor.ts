import Color from "./color";
import {
  AskOpenImages,
  GetEditors,
  ReplaceColor,
} from "../../wailsjs/go/backend/App";
import { editor, options } from "../../wailsjs/go/models";
import Image, { ImageInfo } from "./image";
import StatusManager from "./status";
import Ruse from "./ruses";
export type EditorParamsColors = {
  primary: Color[];
  secondary: Color[];
};
export type EditorParams = {
  colors: Ruse<EditorParamsColors>;
};

export enum EditorMode {
  Normal,
  Pick,
  Fill,
  Replace,
}

export function modeName(m: EditorMode): string {
  switch (m) {
    case EditorMode.Fill:
      return "fill";
    case EditorMode.Pick:
      return "pick";
    case EditorMode.Normal:
      return "normal";
    case EditorMode.Replace:
      return "replace";
  }
}

let done = 0;
export default class Editor {
  id: number;
  file: string;
  params: EditorParams;
  stack: ImageInfo[];
  stackIndex: Ruse<number>;
  mode: Ruse<EditorMode>;
  status: StatusManager;
  view: {
    scale: {
      x: number;
      y: number;
    };
    translation: {
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
        colors: new Ruse<EditorParamsColors>({
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
        }),
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
    this.mode = new Ruse(EditorMode.Normal);
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
      translation: {
        x: 0,
        y: 0,
      },
    };
  }
  toggleMode(
    mode: EditorMode,
    normal: EditorMode = EditorMode.Normal,
  ): EditorMode {
    if (this.mode.getSnapshot() === mode) this.mode.set(normal);
    else this.mode.set(mode);
    return this.mode.getSnapshot();
  }
  setPrimaryColor(col: Color) {
    this.params.colors.update((colors) => {
      colors.primary = [col].concat(
        colors.primary.filter((c) => c.toHexString() != col.toHexString()),
      );
      return colors;
    });
  }
  setSecondaryColor(col: Color) {
    this.params.colors.update((colors) => {
      colors.secondary = [col].concat(
        colors.secondary.filter((c) => c.toHexString() != col.toHexString()),
      );
      return colors;
    });
  }
  async replaceColor(from: Color, to: Color): Promise<number> {
    return await ReplaceColor(
      this.stack[this.stackIndex.getSnapshot()].id,
      Image.colToRGBA(from),
      Image.colToRGBA(to),
    );
  }
}
