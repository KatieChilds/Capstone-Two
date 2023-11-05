import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import axios from "axios";
import countries from "./static/countries";
import defaultAvatar from "./static/avatar_images/user_default_avatar.png";
import maleAvatar from "./static/avatar_images/user_male_avatar.png";
import femaleAvatar from "./static/avatar_images/user_female_avatar.png";
import "./SignupForm.css";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const ProfileForm = () => {
  const { currUserParsed, setCurrUser, token } =
    useContext(CurrUserContext);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();
  const INITIAL_STATE = {
    username: currUserParsed.username,
    password: "",
    firstname: currUserParsed.firstname,
    lastname: currUserParsed.lastname,
    email: currUserParsed.email,
    city: currUserParsed.city,
    country: currUserParsed.country,
    avatar: currUserParsed.avatar,
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);
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
        `${BASE_URL}/users/${currUserParsed.username}`,
        { ...formData },
        { headers: headers }
      );

      setCurrUser(JSON.stringify(user.data.user));
      navigate("/profile");
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        setErrors((e) => [...e, errs]);
        return errors;
      } else {
        setErrors((e) => [
          ...e,
          err.response.data.error.message,
        ]);
        return errors;
      }
    }
  };

  return (
    <div className="form-container">
      <h3>Make changes to your profile</h3>
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
      <form
        className="authForm"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div className="form-row">
            <div className="form-floating mb-3 me-2 col-sm-6">
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
            <div className="form-floating mb-3 col-sm-6">
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
          </div>
          <div className="form-row">
            <div className="form-floating mb-3 me-2 col-sm-6">
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="form-control"
              />
              <label
                htmlFor="firstname"
                className="form-label"
              >
                First Name
              </label>
            </div>
            <div className="form-floating mb-3 col-sm-6">
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="form-control"
              />
              <label
                htmlFor="lastname"
                className="form-label"
              >
                Last Name
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-floating mb-3 col-12">
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
          </div>
          <div className="form-row">
            <div className="form-floating mb-3 me-2 col-sm-6">
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
            <div className="form-group col-sm-6">
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
          </div>
          <div className="form-row">
            <div className="form-check my-4 col-12">
              <label
                htmlFor="avatar"
                className="form-label me-3"
              >
                Choose your avatar:
              </label>
              <input
                type="radio"
                id="default-avatar"
                name="avatar"
                value={defaultAvatar}
                checked={formData.avatar === defaultAvatar}
                onChange={handleChange}
              />
              <label htmlFor="avatar">
                <img
                  className="avatar ms-2 me-3"
                  src={defaultAvatar}
                  alt="default avatar"
                />
              </label>
              <input
                type="radio"
                id="male-avatar"
                name="avatar"
                value={maleAvatar}
                checked={formData.avatar === maleAvatar}
                onChange={handleChange}
              />
              <label htmlFor="avatar">
                <img
                  className="avatar ms-2 me-3"
                  src={maleAvatar}
                  alt="male avatar"
                />
              </label>
              <input
                type="radio"
                id="female-avatar"
                name="avatar"
                value={femaleAvatar}
                checked={formData.avatar === femaleAvatar}
                onChange={handleChange}
              />
              <label htmlFor="avatar">
                <img
                  className="avatar ms-2"
                  src={femaleAvatar}
                  alt="female avatar"
                />
              </label>
            </div>
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
