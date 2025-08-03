import "./TabBar.sass";
import Editor from "../lib/editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export default function TabBar({
  currentEditor,
  setEditor,
  editors,
  setEditors,
}: {
  currentEditor: Editor | null;
  setEditor: Function;
  editors: Editor[];
  setEditors: (_: Editor[]) => void;
}) {
  useEffect(() => {
    Editor.getEditors().then((editors) => {
      setEditors(editors);
    });
  });
  function openFiles() {
    Editor.askOpenFiles().then((newEditors) => {
      setEditors(editors.concat(newEditors));
      if (newEditors.length > 0) setEditor(newEditors.at(-1));
    });
  }
  function openEditor(editor: Editor) {
    editor.status.addMessage({
      content: (
        <>
          <span style={{ marginLeft: "8px" }}>Loading...</span>
        </>
      ),
      align: "right",
      messageClass: "loading-indicator",
      type: "info",
      duration: 5000, // Auto-removes after 5 seconds
    });
    setEditor(editor);
  }
  function closeTab(editor: Editor) {
    editor.destroy().then(() => {
      if (currentEditor && currentEditor.id == editor.id) {
        setEditor(null);
      }
      setEditors(editors.filter((e) => e.id !== editor.id));
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
          onClick={() => openEditor(editor)}
        >
          <span className="title">
            {editor.file.split("/").at(-1)?.split("\\").at(-1)}
          </span>
          <span className="close" onClick={() => closeTab(editor)}>
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
