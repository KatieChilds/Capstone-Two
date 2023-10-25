import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";

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
        className="navbar-brand"
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
              <NavLink to="/map">Map</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink to="/places">Places</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink to="/friends">Friends</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink to="/dates">Dates</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink to="/profile">Profile</NavLink>
            </li>
            <li className="nav-item mx-2">
              <NavLink
                to="/"
                onClick={logout}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      ) : (
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item mx-2">
            <NavLink to="/login">Login</NavLink>
          </li>
          <li className="nav-item mx-2">
            <NavLink to="/signup">Signup</NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
