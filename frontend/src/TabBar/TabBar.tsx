import "./TabBar.sass";
import Editor from "../lib/editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function TabBar({
  currentEditor,
}: {
  currentEditor: Editor | null;
}) {
  const [editors, setEditors] = useState<Editor[]>([]);
  useEffect(() => {
    Editor.getEditors().then((editors) => {
      setEditors(editors);
    });
  });
  return (
    <div className="w3-bar">
      {editors.map((editor) => (
        <button
          className={
            "w3-button w3-bar-item" +
            (currentEditor && currentEditor.id == editor.id ? " selected" : "")
          }
        >
          <span>{editor.file}</span>
          <span>
            <FontAwesomeIcon
              icon={faClose}
              size="2xs"
              className="w3-theme-d5"
            />
          </span>
        </button>
      ))}
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon size="2xs" icon={faAdd} />
      </button>
    </div>
  );
}
