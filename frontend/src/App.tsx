import TabBar from "./TabBar/TabBar";
import EditorComponent from "./Editor/Editor";
import { useState } from "react";
import Editor from "./lib/editor";

export default function App() {
  const [editor, setEditor] = useState<Editor | null>(null);
  return (
    <main className="w3-theme-dark">
      <TabBar currentEditor={editor} />
      <EditorComponent editor={editor} />
    </main>
  );
}
