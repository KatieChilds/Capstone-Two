import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";
import "./AddChildForm.css";

const AddChildForm = () => {
  const { currUser, addChild, setCurrUser } =
    useContext(CurrUserContext);
  const INITAL_STATE = { gender: "", dob: "" };
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITAL_STATE);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const children = await addChild(formData);

    setCurrUser({
      ...currUser,
      children,
    });

    setFormData(INITAL_STATE);
    navigate("/profile");
  };

  return (
    <div>
      <h3 className="text-dark">Add a child</h3>
      <form
        onSubmit={handleSubmit}
        className="add-child-form"
      >
        <div className="form-group mb-3">
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
        <div className="form-group mb-2">
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
        <button className="btn btn-dark">Add</button>
      </form>
    </div>
  );
};

export default AddChildForm;
