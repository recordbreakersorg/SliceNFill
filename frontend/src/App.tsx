import TabBar from "./TabBar/TabBar";
import EditorComponent from "./Editor/Editor";
import { useState } from "react";
import Editor from "./lib/editor";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";

export default function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  return (
    <main className="w3-theme-dark">
      <Menu editor={editor} />
      <TabBar currentEditor={editor} setEditor={setEditor} />
      {editor ? <EditorComponent editor={editor} /> : <Home />}
    </main>
  );
}
