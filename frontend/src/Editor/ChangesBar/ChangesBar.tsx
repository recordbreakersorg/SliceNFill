import { faRedo, faUndo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSyncExternalStore, useState, useEffect } from "react";
import Editor from "../../lib/editor";
import { ImageInfo } from "../../lib/image";
import "./ChangesBar.sass";

function ChangeThumbnail({
  change,
  onClick,
  isSelected,
}: {
  change: ImageInfo;
  onClick: () => void;
  isSelected: boolean;
}) {
  const [thumbnail, setThumbnail] = useState<string>("");

  useEffect(() => {
    change.getThumbnail().then(setThumbnail);
  }, [change]);

  return (
    <button
      className={"stack-button" + (isSelected ? " selected" : "")}
      onClick={onClick}
    >
      <img src={thumbnail} alt={`Change ${change.id}`} />
    </button>
  );
}

export default function ChangesBar({ editor }: { editor: Editor }) {
  const stackIndex = useSyncExternalStore(
    (callback: any) => editor.stackIndex.subscribe(callback),
    () => editor.stackIndex.getSnapshot(),
  );

  const reversedStack = [...editor.stack].reverse();
  const canUndo = stackIndex > 0;
  const canRedo = stackIndex < editor.stack.length - 1;

  return (
    <div className="changes-bar">
      <div className="do-buttons">
        <button
          className="w3-button"
          onClick={() => editor.undo()}
          disabled={!canUndo}
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <button
          className="w3-button"
          onClick={() => editor.redo()}
          disabled={!canRedo}
        >
          <FontAwesomeIcon icon={faRedo} />
        </button>
      </div>
      <div className="changes">
        {reversedStack.map((change, idx) => {
          const originalIndex = editor.stack.length - 1 - idx;
          return (
            <ChangeThumbnail
              key={originalIndex}
              change={change}
              isSelected={originalIndex === stackIndex}
              onClick={() => editor.stackIndex.set(originalIndex)}
            />
          );
        })}
      </div>
    </div>
  );
}
