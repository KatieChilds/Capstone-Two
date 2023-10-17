import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import axios from "axios";
import countries from "./static/countries";
import defaultAvatar from "./static/avatar_images/user_default_avatar.png";
import "./SignupForm.css";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const ProfileForm = () => {
  const { currUser, setCurrUser, token } =
    useContext(CurrUserContext);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();
  const INITIAL_STATE = {
    username: currUser.username,
    password: "",
    firstName: currUser.firstname,
    lastName: currUser.lastname,
    email: currUser.email,
    city: "",
    country: "",
    avatar: currUser.avatar,
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const countryChoices = countries;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (let field of Object.keys(formData)) {
        if (formData[field] === "") {
          delete formData[field];
        }
      }
      delete formData.username;
      let user = await axios.patch(
        `${BASE_URL}/users/${currUser.username}`,
        { ...formData },
        { headers: headers }
      );
      console.log("updated USER", user);
      setCurrUser(user.data.user);
      navigate("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="form-container">
      <form
        className="authForm"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              disabled
            />
            <label
              htmlFor="username"
              className="form-label"
            >
              Username
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
            />
            <label
              htmlFor="password"
              className="form-label"
            >
              Password
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="form-control"
            />
            <label
              htmlFor="firstName"
              className="form-label"
            >
              First Name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="form-control"
            />
            <label
              htmlFor="lastName"
              className="form-label"
            >
              Last Name
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
            />
            <label
              htmlFor="email"
              className="form-label"
            >
              Email
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="form-control"
            />
            <label
              htmlFor="city"
              className="form-label"
            >
              City
            </label>
          </div>
          <div className="form-group">
            <label
              htmlFor="country"
              className="form-label"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">
                -- Please choose an option --
              </option>
              {countryChoices.map((country) => (
                <option
                  key={country}
                  value={country}
                >
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="form-check">
            <label
              htmlFor="avatar"
              className="form-label"
            >
              Choose your avatar:
            </label>
            <input
              type="radio"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
            />
            <label htmlFor="avatar">
              <img
                className="avatar"
                src={defaultAvatar}
                alt="default avatar"
              />
            </label>
          </div>
        </fieldset>
        <button
          className="btn btn-success"
          type="submit"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
