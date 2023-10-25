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
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-floating mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </fieldset>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default LoginForm;
