import React, {
  useState,
  useContext,
  useEffect,
} from "react";
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
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          <div className="form-floating mb-3">
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
