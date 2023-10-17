import React, { useContext, useEffect } from "react";
import CurrUserContext from "./CurrUserContext";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoCard from "./ProfilePhotoCard";
import { v4 as uuid } from "uuid";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { currUser, deleteUser } =
    useContext(CurrUserContext);
  const navigate = useNavigate();

  const handleDelete = () => {
    deleteUser();
    navigate("/");
  };

  useEffect(() => {}, [currUser]);

  return (
    <div>
      <h3>{currUser.username}'s Profile</h3>
      <ProfilePhotoCard />
      <table className="table user-info">
        <tbody>
          <tr className="table-light">
            <th>First Name</th>
            <td>{currUser.firstName}</td>
          </tr>
          <tr className="table-light">
            <th>Last Name</th>
            <td>{currUser.lastName}</td>
          </tr>
          <tr className="table-light">
            <th>Email</th>
            <td>{currUser.email}</td>
          </tr>
        </tbody>
      </table>
      {currUser.children.length !== 0 ? (
        <div className="children-info">
          <h5>Children</h5>
          <ol>
            {currUser.children.map((c) => (
              <li key={uuid()}>
                {c.age}, {c.gender}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <Link
        to="/addChild"
        className="btn btn-dark mx-2 mt-2"
      >
        Add Child
      </Link>
      <Link
        to="/profile/update"
        className="btn btn-primary mx-2 mt-2"
      >
        Update Profile
      </Link>
      <br></br>
      <button
        className="btn btn-danger mt-2"
        onClick={handleDelete}
      >
        <strong>Delete Account</strong>
      </button>
    </div>
  );
};

export default ProfilePage;
