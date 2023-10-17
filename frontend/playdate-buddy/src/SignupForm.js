import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import countries from "./static/countries";
import defaultAvatar from "./static/avatar_images/user_default_avatar.png";
import "./SignupForm.css";

const SignupForm = () => {
  let navigate = useNavigate();
  const countryChoices = countries;
  const INITAL_STATE = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    country: "",
    avatar: defaultAvatar,
  };

  const [formData, setFormData] = useState(INITAL_STATE);
  const { signup } = useContext(CurrUserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
    setFormData(INITAL_STATE);
    navigate("/");
  };

  return (
    <div className="form-container">
      <h3 className="text-info">
        Complete the form below to signup
      </h3>
      <form
        className="AuthForm"
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
          className="btn btn-primary"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
