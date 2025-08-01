import Editor from "../../lib/editor";
import "./ToolBar.sass";

export default function ToolBar({ editor }: { editor: Editor }) {
  return (
    <div className="toolbar">
      <div className="colors"></div>
    </div>
  );
}
