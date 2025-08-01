import { useSyncExternalStore } from "react";
import Editor, { EditorMode, modeName } from "../../lib/editor";
import "./StatusBar.sass";

export default function StatusBar({ editor }: { editor: Editor }) {
  const messages = useSyncExternalStore(
    (callback) => editor.status.subscribe(callback),
    () => editor.status.getSnapshot(),
  );
  const editorMode = useSyncExternalStore(
    (callback) => editor.mode.subscribe(callback),
    () => editor.mode.getSnapshot(),
  );

  const leftMessages = messages.filter((m) => m.align === "left");
  const rightMessages = messages.filter((m) => m.align === "right");

  return (
    <div className="StatusBar w3-bar">
      <p className={"mode w3-bar-item w3-left " + modeName(editorMode)}>
        {modeName(editorMode).toUpperCase()}
      </p>
      {leftMessages.map((message) => (
        <div
          key={message.id}
          className={`w3-left w3-bar-item w3-padding ${message.type || ""}`}
        >
          {message.content}
        </div>
      ))}
      {rightMessages.map((message) => (
        <div
          key={message.id}
          className={`w3-right w3-bar-item w3-padding ${message.type || ""}`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}
