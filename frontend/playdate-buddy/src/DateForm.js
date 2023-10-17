import React, { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";

const DateForm = () => {
  const INITIAL_STATE = {
    timestamp: "",
  };
  const { id } = useParams();
  const navigate = useNavigate();
  const { makeDate } = useContext(CurrUserContext);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const handleChange = (e) => {
    let { name, value } = e.target;

    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    makeDate(id, formData.timestamp);
    setFormData(INITIAL_STATE);
    navigate("/dates");
  };

  return (
    <div className="dateform-container">
      <form
        onSubmit={handleSubmit}
        className="dateform"
      >
        <input
          type="datetime-local"
          id="timestamp"
          name="timestamp"
          value={formData.timestamp}
          onChange={handleChange}
          className="form-control my-2"
        />
        <button className="btn btn-primary btn-sm">
          Save Date
        </button>
      </form>
    </div>
  );
};

export default DateForm;
