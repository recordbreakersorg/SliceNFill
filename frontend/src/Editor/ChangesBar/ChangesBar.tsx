import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSyncExternalStore } from "react";
import Editor from "../../lib/editor";
import "./ChangesBar.sass";

export default function ChangesBar({ editor }: { editor: Editor }) {
  const stackIndex = useSyncExternalStore(
    (callback: any) => editor.stackIndex.subscribe(callback),
    () => editor.stackIndex.getSnapshot(),
  );
  return (
    <div className="changes-bar">
      <div className="do-buttons">
        <button className="w3-button" onClick={editor.redo}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button className="w3-button" onClick={editor.undo}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
      <div className="changes">
        {editor.stack.map((stack, idx) => (
          <button
            className={
              "w3-button w3-block stack-button" +
              (idx == stackIndex ? " selected" : "")
            }
          >
            {idx}
          </button>
        ))}
      </div>
    </div>
  );
}
