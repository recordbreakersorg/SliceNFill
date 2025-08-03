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
    <div className="StatusBar">
      <span className={"mode " + modeName(editorMode).toLowerCase()}>
        {modeName(editorMode).toUpperCase()}
      </span>
      <div className="message-container">
        <div className="left-messages">
          {leftMessages.map((message) => (
            <span
              key={message.id}
              className={`message ${message.type || ""}`}
            >
              {message.content}
            </span>
          ))}
        </div>
        <div className="right-messages">
          {rightMessages.map((message) => (
            <span
              key={message.id}
              className={`message ${message.type || ""}`}
            >
              {message.content}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
