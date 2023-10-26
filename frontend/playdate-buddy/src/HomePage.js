import React, { useContext } from "react";
import currUserContext from "./CurrUserContext";
const slide = require("./static/slide.png");
const picnic = require("./static/picnic.png");
const playground = require("./static/playground.jpg");
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const { currUserParsed } = useContext(currUserContext);

  return (
    <div className="HomePage">
      {currUserParsed !== null ? (
        <div>
          <h1 className="text-dark">Playdate Buddy</h1>
          <div className="image-container">
            <div className="image-column">
              <img
                src={slide}
                className="HomePage-image"
                alt="climbing-frame"
              />
              <h3 className="text-info">Play</h3>
            </div>
            <div className="image-column">
              <img
                src={playground}
                className="HomePage-image"
                alt="playground"
              />
              <h3 className="text-info">Explore</h3>
            </div>
            <div className="image-column">
              <img
                src={picnic}
                className="HomePage-image"
                alt="picnic"
              />
              <h3 className="text-info">Make Friends</h3>
            </div>
          </div>
          <h4>Welcome back, {currUserParsed.username}!</h4>
          <Link
            to="/map"
            className="btn btn-primary fw-bold mx-2"
          >
            My Map
          </Link>
          <Link
            to="/users"
            className="btn btn-info fw-bold"
          >
            Show Users
          </Link>
        </div>
      ) : (
        <div>
          <h1 className="text-dark">Playdate Buddy</h1>
          <div className="image-container">
            <div className="image-column">
              <img
                src={slide}
                className="HomePage-image"
                alt="climbing-frame"
              />
              <h3 className="text-info">Play</h3>
            </div>
            <div className="image-column">
              <img
                src={playground}
                className="HomePage-image"
                alt="playground"
              />
              <h3 className="text-info">Explore</h3>
            </div>
            <div className="image-column">
              <img
                src={picnic}
                className="HomePage-image"
                alt="picnic"
              />
              <h3 className="text-info">Make Friends</h3>
            </div>
          </div>
          <Link
            to="/login"
            className="btn btn-primary fw-bold me-3"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="btn btn-primary fw-bold"
          >
            Signup
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
