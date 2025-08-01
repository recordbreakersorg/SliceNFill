import { useSyncExternalStore } from "react";
import Editor from "../lib/editor";
import ImageView from "./ImageView/ImageView";
import StatusBar from "./StatusBar/StatusBar";
import "./Editor.sass";
import ActionBar from "./ActionBar/ActionBar";
import ToolBar from "./ToolBar/ToolBar";

export default function EditorComponent({ editor }: { editor: Editor }) {
  const imageIdx = useSyncExternalStore(
    (callback: any) => editor.stackIndex.subscribe(callback),
    () => editor.stackIndex.getSnapshot(),
  );
  const image = editor.stack[imageIdx];
  let resetpos: null | (() => void) = null;
  return (
    <div className="editor-container">
      <div className="toolbar-container">
        <ToolBar editor={editor} />
      </div>
      <div
        className="action-bar-container"
        onDoubleClick={() => resetpos && resetpos()}
      >
        <ActionBar editor={editor} getReset={(f) => (resetpos = f)} />
      </div>
      <div className="view">
        {image ? (
          <ImageView imageInfo={image} editor={editor} />
        ) : (
          <h3>No image loaded</h3>
        )}
      </div>

      <div className="status">
        <StatusBar editor={editor} />
      </div>
    </div>
  );
}
