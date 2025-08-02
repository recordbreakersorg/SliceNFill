import Editor from "../lib/editor";
import "../w3/util.sass";
import "./Menu.sass";

export default function Menu({
  editor,
  setEditor,
  editors,
  setEditors,
}: {
  editor: Editor | null;
  setEditor: (_: Editor) => void;
  editors: Editor[];
  setEditors: (_: Editor[]) => void;
}) {
  function openFiles() {
    Editor.askOpenFiles().then(function (newEditors) {
      setEditors(editors.concat(newEditors));
      if (newEditors.length > 0) setEditor(newEditors.at(-1)!);
    });
  }
  return (
    <div className="w3-bar">
      <button className="w3-button w3-bar-item" onClick={openFiles}>
        Open
      </button>
      {editor && (
        <>
          <button className="w3-button w3-bar-item">Close</button>
          <div className="w3-dropdown-hover">
            <button className="w3-button w3-bar-item">Export</button>
            <span className="w3-dropdown-content w3-bar-block w3-border w3-theme">
              <button className="w3-bar-item w3-button w3-tooltip">PNG</button>
              <button className="w3-bar-item w3-button w3-tooltip">JPEG</button>
              <button className="w3-bar-item w3-button w3-tooltip">TIFF</button>
              <button className="w3-bar-item w3-button w3-tooltip">BMP</button>
              <button className="w3-bar-item w3-button w3-tooltip">ICO</button>
            </span>
          </div>
        </>
      )}
    </div>
  );
}
