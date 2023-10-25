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

  return (
    <div>
      <h3>{currUserParsed.username}'s Profile</h3>
      <ProfilePhotoCard />
      <table className="table user-info">
        <tbody>
          <tr className="table-light">
            <th>First Name</th>
            <td>{currUserParsed.firstname}</td>
          </tr>
          <tr className="table-light">
            <th>Last Name</th>
            <td>{currUserParsed.lastname}</td>
          </tr>
          <tr className="table-light">
            <th>Email</th>
            <td>{currUserParsed.email}</td>
          </tr>
        </tbody>
      </table>
      {currUserParsed.children.length !== 0 ? (
        <div className="children-info">
          <h5>Children</h5>
          <ol>
            {currUserParsed.children.map((c) => (
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
      {errors ? (
        <div>
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
