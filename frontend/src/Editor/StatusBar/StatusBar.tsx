import { useSyncExternalStore } from "react";
import Editor from "../../lib/editor";
import "./StatusBar.sass";

export default function StatusBar({ editor }: { editor: Editor }) {
  const messages = useSyncExternalStore(
    (callback) => editor.status.subscribe(callback),
    () => editor.status.getSnapshot(),
  );

  const leftMessages = messages.filter((m) => m.align === "left");
  const rightMessages = messages.filter((m) => m.align === "right");

  return (
    <div className="StatusBar w3-bar">
      <div className="left-items">
        {leftMessages.map((message) => (
          <div
            key={message.id}
            className={`w3-bar-item w3-padding ${message.type || ""}`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div className="right-items">
        {rightMessages.map((message) => (
          <div
            key={message.id}
            className={`w3-bar-item w3-padding ${message.type || ""}`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
}
