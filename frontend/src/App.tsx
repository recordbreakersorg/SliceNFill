import TabBar from "./TabBar/TabBar";
import EditorComponent from "./Editor/Editor";
import { useState } from "react";
import Editor from "./lib/editor";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import "./App.sass";

export default function App() {
  const [editors, setEditors] = useState<Editor[]>([]);
  const [editor, setEditor] = useState<Editor | null>(null);
  if (editors.length > 0 && editor == null) setEditor(editors.at(-1)!);
  return (
    <div className="app-container">
      <Menu
        editor={editor}
        setEditor={setEditor}
        editors={editors}
        setEditors={setEditors}
      />
      <main>
        <div className="tab-bar-container">
          <TabBar
            currentEditor={editor}
            setEditor={setEditor}
            editors={editors}
            setEditors={setEditors}
          />
        </div>
        <div className="content-container">
          {editor ? (
            <EditorComponent editor={editor} />
          ) : (
            <Home setEditor={setEditor} setEditors={setEditors} />
          )}
        </div>
      </main>
    </div>
  );
}
