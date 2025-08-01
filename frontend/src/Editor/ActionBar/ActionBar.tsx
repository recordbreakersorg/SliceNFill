import {
  faEyeDropper,
  faFill,
  faGripVertical,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Editor from "../../lib/editor";
import "./ActionBar.sass";

export default function ActionBar({ editor }: { editor: Editor }) {
  const [yPos, setyPos] = useState(0);
  const [xPos, setxPos] = useState(0);
  let moving: boolean = false;
  useEffect(() => {
    const mup = () => (moving = false);
    const mmove = (e: any) => {
      if (!moving) return;
      setyPos(yPos + e.movementY);
      setxPos(xPos + e.movementX);
    };
    window.addEventListener("mouseup", mup);
    window.addEventListener("mousemove", mmove);
    return () => {
      window.removeEventListener("mouseup", mup);
      window.removeEventListener("mousemove", mmove);
    };
  });
  return (
    <div
      className="action-bar w3-bar-block"
      style={{
        position: "absolute",
        left: xPos,
        top: yPos,
      }}
    >
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faEyeDropper} />
      </button>
      <hr />
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faFill} />
      </button>
      <button className="w3-button w3-bar-item">
        <FontAwesomeIcon icon={faRemove} />
      </button>

      <span
        className="w3-bar-item handle"
        onMouseDown={() => (moving = true)}
        onClick={() => (moving = !moving)}
      ></span>
    </div>
  );
}
