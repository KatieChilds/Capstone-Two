import React, { useContext } from "react";
import currUserContext from "./CurrUserContext";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const { currUserParsed } = useContext(currUserContext);

  const appInfo = `Playdate Buddy is designed to help you search for places to take your children and read reviews left by real parents with information that you actually care about. It also allows you to make new friends and set up playdates for your children! 
  Explore new places and make new friends all through one app - so go Play!`;

  return (
    <div className="HomePage">
      {currUserParsed !== null ? (
        <div>
          <h1 className="text-dark">Playdate Buddy</h1>
          <div className="image-container">
            <div className="image-text">
              <h2>
                <span>Play</span>
                <span>Explore</span>
                <span>Make Friends</span>
              </h2>
              <Link
                to="/map"
                className="btn btn-info fw-bold mx-2"
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
          </div>
          <h4>Welcome back, {currUserParsed.username}!</h4>
          <p>{appInfo}</p>
        </div>
      ) : (
        <div>
          <h1 className="text-dark">Playdate Buddy</h1>
          <div className="image-container">
            <div className="image-text">
              <h2>
                <span>Play</span>
                <span>Explore</span>
                <span>Make Friends</span>
              </h2>
              <Link
                to="/login"
                className="btn btn-info fw-bold me-3"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-info fw-bold"
              >
                Signup
              </Link>
            </div>
          </div>
          <p>{appInfo}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
