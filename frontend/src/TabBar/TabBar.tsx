import "./TabBar.sass";
import Editor from "../lib/editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function TabBar({
  currentEditor,
  setEditor,
}: {
  currentEditor: Editor | null;
  setEditor: Function;
}) {
  const [editors, setEditors] = useState<Editor[]>([]);
  useEffect(() => {
    Editor.getEditors().then((editors) => {
      setEditors(editors);
    });
  });
  function openFiles() {
    Editor.askOpenFiles().then((newEditors) => {
      setEditors(editors.concat(newEditors));
    });
  }
  return (
    <div className="w3-bar">
      {editors.map((editor) => (
        <button
          className={
            "w3-button w3-bar-item" +
            (currentEditor && currentEditor.id == editor.id ? " selected" : "")
          }
          onClick={() => setEditor(editor)}
        >
          <span className="title">
            {editor.file.split("/").at(-1)?.split("\\").at(-1)}
          </span>
          <span className="close">
            <FontAwesomeIcon icon={faClose} size="lg" className="w3-theme-d5" />
          </span>
        </button>
      ))}
      <button className="w3-button w3-bar-item add" onClick={openFiles}>
        <FontAwesomeIcon size="sm" icon={faAdd} className="icon" />
      </button>
    </div>
  );
}
