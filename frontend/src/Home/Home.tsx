import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/images/logo.svg";
import "./Home.sass";
export default function Home() {
  return (
    <div className="home">
      <div className="w3-theme-dark hero w3-center w3-padding-64">
        <h1 className="">
          <img src={logo} width="100" className="w3-margin-right" />
          <span>slice</span>
          <span>'</span>
          <span>n</span>
          <span>'</span>
          <span>fill</span>
        </h1>
      </div>
      <div className="welcome w3-container w3-theme w3-justify w3-large">
        <p>
          Slice'N'Fill, is a simple to use image edition tool for quickly
          tweaking on images before using in documents(like presentations).
        </p>
        <ul>
          <li>
            Floodfill and replace image colors(with tolerance for better
            rendering)
          </li>
          <li>Image format conversion with support for multiple formats.</li>
          <li>Light-weight, easy to use an portable</li>
        </ul>
        <p>
          You could just get started to use it By clicking on the{" "}
          <FontAwesomeIcon icon={faPlus} /> icon
        </p>
      </div>
    </div>
  );
}
