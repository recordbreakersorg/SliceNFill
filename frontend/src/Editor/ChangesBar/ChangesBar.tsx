import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSyncExternalStore } from "react";
import Editor from "../../lib/editor";
import { ImageInfo } from "../../lib/image";
import "./ChangesBar.sass";

export default function ChangesBar({ editor }: { editor: Editor }) {
  const stackIndex = useSyncExternalStore(
    (callback: any) => editor.stackIndex.subscribe(callback),
    () => editor.stackIndex.getSnapshot(),
  );
  const reversedStack = [...editor.stack].reverse();

  return (
    <div className="changes-bar">
      <div className="do-buttons">
        <button className="w3-button" onClick={() => editor.undo()}>
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button className="w3-button" onClick={() => editor.redo()}>
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
      <div className="changes">
        {reversedStack.map((change, idx) => {
          const originalIndex = editor.stack.length - 1 - idx;
          return (
            <button
              className={
                "w3-button stack-button" +
                (originalIndex === stackIndex ? " selected" : "")
              }
              onClick={() => editor.stackIndex.set(originalIndex)}
              key={originalIndex}
            >
              {originalIndex}
            </button>
          );
        })}
      </div>
    </div>
  );
}
