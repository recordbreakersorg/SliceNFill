import { useEffect, useState } from "react";
import { img } from "../../wailsjs/go/models";
import Editor from "../lib/editor";
import Image from "../lib/image";
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
  const [formats, setFormats] = useState<img.ImageFormat[]>([]);
  function openFiles() {
    Editor.askOpenFiles().then(function (newEditors) {
      setEditors(editors.concat(newEditors));
      if (newEditors.length > 0) setEditor(newEditors.at(-1)!);
    });
  }
  const exporter = (format: img.ImageFormat) => () => {
    editor?.exportAs(format);
  };
  useEffect(() => {
    Image.getFormats().then(setFormats);
  });
  return (
    <div className="w3-bar">
      <button className="w3-button w3-bar-item" onClick={openFiles}>
        Open
      </button>
      {editor && (
        <>
          <div className="w3-dropdown-hover">
            <button className="w3-button w3-bar-item">Export</button>
            <span className="w3-dropdown-content w3-bar-block w3-border w3-theme">
              {formats
                .filter((f) => f.CanWrite)
                .map((format) => (
                  <button
                    className="w3-bar-item w3-button w3-tooltip"
                    onClick={exporter(format)}
                    key={format.Extension}
                  >
                    {format.Name} ({format.Extension})
                  </button>
                ))}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
