import TabBar from "./TabBar/TabBar";
import Editor from "./Editor/Editor";
import { useState } from "react";

export default function App() {
  const [editor, setEditor] = useState(null);
  return (
    <main className="w3-theme-dark">
      <TabBar />
      <Editor />
    </main>
  );
}
