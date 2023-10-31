import React, {
  useState,
  useContext,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import countries from "./static/countries";
import defaultAvatar from "./static/avatar_images/user_default_avatar.png";
import maleAvatar from "./static/avatar_images/user_male_avatar.png";
import femaleAvatar from "./static/avatar_images/user_female_avatar.png";
import "./SignupForm.css";

const SignupForm = () => {
  let navigate = useNavigate();
  const countryChoices = countries;
  const INITAL_STATE = {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    city: "",
    country: "",
    avatar: defaultAvatar,
  };

  const [formData, setFormData] = useState(INITAL_STATE);
  const [errors, setErrors] = useState([]);
  const { signup } = useContext(CurrUserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("handling change of:", name, value);
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const signupResult = await signup(formData);
    if (!signupResult.success) {
      setErrors((errs) => [...errs, signupResult.errors]);
      return errors;
    }
    setFormData(INITAL_STATE);
    navigate("/");
  };

  useEffect(() => {}, [errors]);

  return (
    <div className="form-container">
      <h3 className="text-info">
        Complete the form below to signup
      </h3>
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
