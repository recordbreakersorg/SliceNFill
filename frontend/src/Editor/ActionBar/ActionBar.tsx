import {
  faBucket,
  faEyeDropper,
  faFill,
  faGripVertical,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import Editor, { EditorMode } from "../../lib/editor";
import "./ActionBar.sass";

const o = {
  x: 12,
  y: 13,
};

const clamp = (val: number, min: number, max: number): number =>
  val < min ? min : val > max ? max : val;

export default function ActionBar({ editor }: { editor: Editor }) {
  const [position, setPosition] = useState(o);
  const movingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const editorMode = useSyncExternalStore(
    (callback: any) => editor.mode.subscribe(callback),
    () => editor.mode.getSnapshot(),
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    movingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    movingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (e.button !== 0) return;
    if (!movingRef.current) return;
    e.preventDefault();

    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setPosition((prevPosition) => ({
      x: prevPosition.x + deltaX,
      y: prevPosition.y + deltaY,
    }));
  }, []);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseUp, handleMouseMove]);
  const toggleMode = (newMode: EditorMode) => () => {
    editor.mode.update((mode) =>
      mode === newMode ? EditorMode.Normal : newMode,
    );
  };

  function restorPositionAnimation() {
    setPosition(o);
  }

  return (
    <div
      className="action-bar w3-bar-block"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      <button
        className={
          "w3-button w3-bar-item" +
          (editorMode === EditorMode.Pick ? " active" : "")
        }
        onClick={toggleMode(EditorMode.Pick)}
      >
        <FontAwesomeIcon icon={faEyeDropper} size="xl" />
      </button>
      <hr />
      <button
        className={
          "w3-button w3-bar-item" +
          (editorMode === EditorMode.Fill ? " active" : "")
        }
        onClick={toggleMode(EditorMode.Fill)}
      >
        <FontAwesomeIcon icon={faBucket} size="xl" />
      </button>
      <button
        className={
          "w3-button w3-bar-item" +
          (editorMode === EditorMode.Replace ? " active" : "")
        }
        onClick={toggleMode(EditorMode.Replace)}
      >
        <FontAwesomeIcon icon={faFill} size="xl" />
      </button>
      <span
        className={
          "w3-bar-item handle" +
          (position.x == o.x && position.y == o.y ? "" : " expanded")
        }
        onMouseDown={handleMouseDown}
        onDoubleClick={restorPositionAnimation}
      ></span>
    </div>
  );
}
