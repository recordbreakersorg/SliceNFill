import { faFolderOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/images/logo-universal.png";
import Editor from "../lib/editor";
import "./Home.sass";

export default function Home({
  setEditor,
  setEditors,
}: {
  setEditor: (editor: Editor) => void;
  setEditors: (editors: Editor[]) => void;
}) {
  function openFiles() {
    Editor.askOpenFiles().then((newEditors) => {
      if (newEditors.length > 0) {
        setEditors(newEditors);
        setEditor(newEditors[0]);
      }
    });
  }

  return (
    <div className="home-container">
      <div className="hero-section">
        <img src={logo} className="logo" alt="Slice'N'Fill Logo" />
        <h1 className="title">
          <span>slice</span>
          <span>'</span>
          <span>n</span>
          <span>'</span>
          <span>fill</span>
        </h1>
        <p className="subtitle">
          A lightweight and straightforward tool for quick image edits.
        </p>
      </div>

      <div className="action-section">
        <button className="open-button" onClick={openFiles}>
          <FontAwesomeIcon icon={faFolderOpen} />
          <span>Open Images</span>
        </button>
      </div>

      <div className="features-section">
        <div className="feature">
          <h3>Quick Color Tweaks</h3>
          <p>
            Use Floodfill and Replace tools with tolerance support for smarter
            color changes.
          </p>
        </div>
        <div className="feature">
          <h3>Format Conversion</h3>
          <p>
            Easily convert your images between multiple supported formats like
            PNG, JPEG, and BMP.
          </p>
        </div>
        <div className="feature">
          <h3>Simple & Portable</h3>
          <p>
            No complex setups. Just a simple, fast tool for the edits you need.
          </p>
        </div>
      </div>
    </div>
  );
}
