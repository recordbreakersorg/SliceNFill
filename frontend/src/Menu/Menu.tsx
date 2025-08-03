import { useEffect, useState } from "react";
import { img } from "../../wailsjs/go/models";
import Editor from "../lib/editor";
import Image from "../lib/image";
import "./Menu.sass";

export default function Menu({
  editor,
  setEditor,
  editors,
  setEditors,
}: {
  editor: Editor | null;
  setEditor: (editor: Editor) => void;
  editors: Editor[];
  setEditors: (editors: Editor[]) => void;
}) {
  const [formats, setFormats] = useState<img.ImageFormat[]>([]);

  function openFiles() {
    Editor.askOpenFiles().then((newEditors) => {
      if (newEditors.length > 0) {
        setEditors([...editors, ...newEditors]);
        setEditor(newEditors[0]);
      }
    });
  }

  const exporter = (format: img.ImageFormat) => () => {
    editor?.exportAs(format);
  };

  useEffect(() => {
    Image.getFormats().then(setFormats);
  }, []);

  return (
    <nav className="menu-bar">
      <div className="menu-item">
        <button className="menu-button" onClick={openFiles}>
          Open
        </button>
      </div>
      {editor && (
        <div className="menu-item has-dropdown">
          <button className="menu-button">Export</button>
          <div className="dropdown-content">
            {formats
              .filter((f) => f.CanWrite)
              .map((format) => (
                <button
                  className="dropdown-item"
                  onClick={exporter(format)}
                  key={format.Extension}
                >
                  {format.Name} ({format.Extension})
                </button>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
}
