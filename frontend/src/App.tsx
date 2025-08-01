import TabBar from "./TabBar/TabBar";
import EditorComponent from "./Editor/Editor";
import { useState } from "react";
import Editor from "./lib/editor";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import "./App.sass";

export default function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  return (
    <main className="w3-theme-dark">
      <div className="nav">
        <Menu editor={editor} />
        <TabBar currentEditor={editor} setEditor={setEditor} />
      </div>
      <div className="editor">
        {editor ? <EditorComponent editor={editor} /> : <Home />}
      </div>
    </main>
  );
}
