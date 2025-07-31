import Editor from "../lib/editor";

export default function Menu({ editor }: { editor: Editor | null }) {
  return (
    <div className="w3-bar">
      <button className="w3-button w3-bar-item">Open</button>
      {editor && (
        <>
          <button className="w3-button w3-bar-item">Close</button>
          <div className="w3-dropdown-hover">
            <button className="w3-button w3-bar-item">Export</button>
            <div className="w3-dropdown-content w3-bar-block w3-border">
              <button className="w3-bar-item w3-button">PNG</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
