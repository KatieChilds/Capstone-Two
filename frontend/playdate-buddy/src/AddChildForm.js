import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import "./AddChildForm.css";

const AddChildForm = () => {
  const { currUserParsed, addChild, setCurrUser } =
    useContext(CurrUserContext);
  const INITAL_STATE = { gender: "", dob: "" };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITAL_STATE);
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const childrenResult = await addChild(formData);
    if (!childrenResult.success) {
      setErrors((errs) => [...errs, childrenResult.errors]);
      return errors;
    }
    const user = {
      ...currUserParsed,
      children: childrenResult.children,
    };
    setCurrUser(JSON.stringify(user));

    setFormData(INITAL_STATE);
    navigate("/profile");
  };

  return (
    <div>
      <h3 className="text-dark">Add a child</h3>
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
        onSubmit={handleSubmit}
        className="add-child-form"
      >
        <div className="form-row">
          <div className="form-group mb-3 me-2 col">
            <label
              className="form-label"
              htmlFor="gender"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
            >
              <option value="">
                -- Please choose an option --
              </option>
              <option
                value="male"
                key="male"
              >
                Male
              </option>
              <option
                value="female"
                key="female"
              >
                Female
              </option>
              <option
                value="na"
                key="na"
              >
                N/A
              </option>
            </select>
          </div>
          <div className="form-group mb-2 col">
            <label
              className="form-label"
              htmlFor="dob"
            >
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
        <button className="btn btn-dark">Add</button>
      </form>
    </div>
  );
};

export default AddChildForm;
