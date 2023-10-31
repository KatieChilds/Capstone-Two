import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import "./Navbar.css";

const Navbar = () => {
  const { currUserParsed, logout } =
    useContext(CurrUserContext);

  return (
    <nav
      className="navbar navbar-expand-lg bg-primary"
      data-bs-theme="dark"
    >
      <NavLink
        to="/"
        className="navbar-brand navbar-title"
      >
        <i className="fa-solid fa-cubes mx-2 text-dark">
          {" "}
        </i>
        Playdate Buddy
      </NavLink>
      {currUserParsed !== null ? (
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <NavLink
                to="/map"
                className="nav-link"
              >
                Map
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/places"
                className="nav-link"
              >
                Places
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/friends"
                className="nav-link"
              >
                Friends
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/dates"
                className="nav-link"
              >
                Dates
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/profile"
                className="nav-link"
              >
                Profile
              </NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/"
                onClick={logout}
                className="nav-link"
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item mx-2">
            <NavLink
              to="/login"
              className="nav-link"
            >
              Login
            </NavLink>
          </li>
          <li className="nav-item mx-2">
            <NavLink
              to="/signup"
              className="nav-link"
            >
              Signup
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
