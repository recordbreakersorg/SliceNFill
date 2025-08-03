import { useSyncExternalStore } from "react";
import Color from "../../lib/color";
import Editor from "../../lib/editor";
import "./ToolBar.sass";
import { EditorParamsColors } from "../../lib/editor";

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
    editor.params.colors.update((colors) => ({
      primary: [col, ...colors.primary.filter((c) => !c.equals(col))],
      secondary: colors.secondary,
    }));
  };

  const stackSecondary = (col: Color) => {
    editor.params.colors.update((colors) => ({
      primary: colors.primary,
      secondary: [col, ...colors.secondary.filter((c) => !c.equals(col))],
    }));
  };

  return (
    <div className="toolbar">
      <div className="tool-group colors">
        <div className="color-section">
          <div className="color-swatches">
            <input
              className="color-picker-input"
              type="color"
              value={(colors.primary[0] ?? new Color()).toHexString()}
              onChange={(e) => stackPrimary(Color.fromCSS(e.target.value))}
            />
            {colors.primary.slice(0, 10).map((col: Color, i) => (
              <span
                key={i}
                className="color-card"
                style={{ backgroundColor: col.toHexString() }}
                onClick={() => stackPrimary(col)}
              ></span>
            ))}
          </div>
          <div className="color-swatches">
            <input
              className="color-picker-input"
              type="color"
              value={(colors.secondary[0] ?? new Color()).toHexString()}
              onChange={(e) => stackSecondary(Color.fromCSS(e.target.value))}
            />
            {colors.secondary.slice(0, 10).map((col: Color, i) => (
              <span
                key={i}
                className="color-card"
                style={{ backgroundColor: col.toHexString() }}
                onClick={() => stackSecondary(col)}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <div className="tool-group tolerance">
        <label htmlFor="tolerance-slider">
          Tolerance: {editorTolerance.toFixed(0)}
        </label>
        <input
          id="tolerance-slider"
          type="range"
          onChange={(e) => editor.params.tolerance.set(Number(e.target.value))}
          min="0"
          max={Math.ceil(Math.sqrt(255 * 255 * 3))}
          step="1"
          value={editorTolerance}
        />
      </div>
    </div>
  );
}
