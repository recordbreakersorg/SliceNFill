import { faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useSyncExternalStore } from "react";
import Color from "../../lib/color";
import Editor from "../../lib/editor";
import "./ToolBar.sass";
import { EditorParamsColors } from "../../lib/editor";

let a = 0;

export default function ToolBar({ editor }: { editor: Editor }) {
  const colors: EditorParamsColors = useSyncExternalStore(
    (callback: any) => editor.params.colors.subscribe(callback),
    () => editor.params.colors.getSnapshot(),
  );
  const editorTolerance: number = useSyncExternalStore(
    (callback: any) => editor.params.tolerance.subscribe(callback),
    () => editor.params.tolerance.getSnapshot(),
  );
  const stackPrimary = (col: Color) => {
    editor.params.colors.update((colors) => {
      console.log("stacking primary", col);
      return {
        primary: [col].concat(colors.primary.filter((c) => c != col)),
        secondary: colors.secondary,
      };
    });
  };
  const stackSecondary = (col: Color) => {
    console.log("stacking secondary", col);
    editor.params.colors.update((colors) => {
      return {
        primary: colors.primary,
        secondary: [col].concat(colors.secondary.filter((c) => c != col)),
      };
    });
  };
  return (
    <div className="toolbar">
      <div className="colors">
        <div className="primary">
          <input
            type="color"
            value={(colors.primary[0] ?? new Color()).toHexString()}
            onChange={(e) => stackPrimary(Color.fromCSS(e.target.value))}
          />
          {colors.primary.slice(0, 10).map((col: Color) => (
            <span className="color-card" onClick={() => stackPrimary(col)}>
              <FontAwesomeIcon icon={faSquare} color={col.toHexString()} />
            </span>
          ))}
        </div>
        <div className="secondary">
          <input
            type="color"
            value={(colors.secondary[0] ?? new Color()).toHexString()}
            onChange={(e) => stackSecondary(Color.fromCSS(e.target.value))}
          />
          {colors.secondary.slice(0, 10).map((col: Color) => (
            <span className="color-card" onClick={() => stackSecondary(col)}>
              <FontAwesomeIcon icon={faSquare} color={col.toHexString()} />
            </span>
          ))}
        </div>
      </div>
      <div className="tolerance">
        <label>Tolerance: {editorTolerance}</label>
        <input
          type="range"
          onChange={(e) => editor.params.tolerance.set(Number(e.target.value))}
          min="0"
          max={Math.sqrt(255 * 255 * 3)}
          value={editorTolerance}
        />
      </div>
    </div>
  );
}
