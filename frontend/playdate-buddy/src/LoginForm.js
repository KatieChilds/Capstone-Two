import React, { useContext, useState } from "react";
import CurrUserContext from "./CurrUserContext";
import { useNavigate } from "react-router-dom";
import "./SignupForm.css";

const LoginForm = () => {
  let navigate = useNavigate();
  const INITIAL_STATE = { username: "", password: "" };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);
  const { login } = useContext(CurrUserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginResult = await login(formData);
    if (!loginResult.success) {
      setErrors((errs) => [...errs, loginResult.errors]);
      return errors;
    }
    setFormData(INITIAL_STATE);
    navigate("/");
  };

  return (
    <div className="form-container">
      <h3 className="text-info">Login below</h3>
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
            <div className="form-floating mb-3 me-2 col-12">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                placeholder="Username"
              />
              <label htmlFor="username">Username</label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-floating mb-3 col-12">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
            </div>
          </div>
        </fieldset>
        <button
          className="btn btn-primary"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
