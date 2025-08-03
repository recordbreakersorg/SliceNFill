import TabBar from "./TabBar/TabBar";
import EditorComponent from "./Editor/Editor";
import { useState } from "react";
import Editor from "./lib/editor";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import "./App.sass";

export default function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [editors, setEditors] = useState<Editor[]>([]);
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
