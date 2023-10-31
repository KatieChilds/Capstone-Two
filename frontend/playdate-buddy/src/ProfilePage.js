import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import CurrUserContext from "./CurrUserContext";
import { Link, useNavigate } from "react-router-dom";
import ProfilePhotoCard from "./ProfilePhotoCard";
import { v4 as uuid } from "uuid";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { currUserParsed, deleteUser } =
    useContext(CurrUserContext);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const deleteResult = await deleteUser();
    if (!deleteResult.success) {
      setErrors((errs) => [...errs, deleteResult.errors]);
      return errors;
    }
    navigate("/");
    return (
      <alert>
        <p>deleteResult.msg</p>
      </alert>
    );
  };

  useEffect(() => {}, [currUserParsed]);
  console.log("errors?", errors);

  return (
    <div className="profile-page">
      <div className="profile-col-one">
        <h3>{currUserParsed.username}'s Profile</h3>
        <ProfilePhotoCard />
        <p className="user-info">
          <strong>First Name:</strong>
          {currUserParsed.firstname}
          <br></br>
          <strong>Last Name:</strong>
          {currUserParsed.lastname}
          <br></br>
          <strong>Email:</strong>
          {currUserParsed.email}
        </p>
        <Link
          to="/profile/update"
          className="btn btn-warning mx-2 mt-2"
        >
          Update Profile
        </Link>
        <br></br>
        <button
          className="btn btn-danger mb-2 mt-2"
          onClick={handleDelete}
        >
          <strong>Delete Account</strong>
        </button>
      </div>
      <div className="profile-col-two">
        {currUserParsed.children.length !== 0 ? (
          <div className="children-info">
            <h5>Children:</h5>
            <ul>
              {currUserParsed.children.map((c) => (
                <li key={uuid()}>
                  {c.age}, {c.gender}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <Link
          to="/addChild"
          className="btn btn-dark mx-2 mb-2 mt-2"
        >
          Add Child
        </Link>
      </div>
      <br></br>
      {errors.length !== 0 ? (
        <div className="errors-container">
          {errors.map((error, index) => (
            <p
              className="error-msg"
              key={index}
            >
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProfilePage;
