import {
  faEyeDropper,
  faFill,
  faGripVertical,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useRef, useCallback } from "react";
import Editor from "../../lib/editor";
import "./ActionBar.sass";

export default function ActionBar({ editor }: { editor: Editor }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const movingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    movingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseUp = useCallback(() => {
    movingRef.current = false;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
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

  return (
    <div
      className="action-bar w3-bar-block"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
    >
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faEyeDropper} size="xl" />
      </button>
      <hr />
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faFill} size="xl" />
      </button>
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faRemove} size="xl" />
      </button>

      <span className="w3-bar-item handle" onMouseDown={handleMouseDown}></span>
    </div>
  );
}

