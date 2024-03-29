import React, { useState, useContext } from "react";
import CurrUserContext from "./CurrUserContext";
import { useNavigate, useParams } from "react-router-dom";
import "./ReviewForm.css";

const ReviewForm = () => {
  const { id } = useParams();
  const { leaveReview } = useContext(CurrUserContext);
  const INITIAL_STATE = {
    bathroom: false,
    changingTable: false,
    highchair: false,
    parking: false,
    otherNotes: "",
    stars: 0,
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (e.target.type === "checkbox") {
      value = true;
    }
    if (e.target.type === "range") {
      e.target.style.setProperty("--value", `${value}`);
      value = +value;
    }
    setFormData((fData) => ({ ...fData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reviewResult = await leaveReview(id, formData);
    if (!reviewResult.success) {
      setErrors((errs) => [...errs, reviewResult.errors]);
      return errors;
    }
    setFormData(INITIAL_STATE);
    navigate(`/places/${id}`);
  };

  return (
    <div className="reviewForm-container">
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
        className="reviewForm"
        onSubmit={handleSubmit}
      >
        <h4>Leave a Review</h4>
        <div className="form-row">
          <div className="col-sm-6">
            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor="bathroom"
              >
                Bathroom
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                value={formData.bathroom}
                id="bathroom"
                name="bathroom"
                onChange={handleChange}
              />
            </div>
            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor="changingTable"
              >
                Changing Table
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                value={formData.changingTable}
                id="changingTable"
                name="changingTable"
                onChange={handleChange}
              />
            </div>
            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor="highchair"
              >
                Highchair
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                value={formData.highchair}
                id="highchair"
                name="highchair"
                onChange={handleChange}
              />
            </div>
            <div className="form-check">
              <label
                className="form-check-label"
                htmlFor="parking"
              >
                Parking
              </label>
              <input
                className="form-check-input"
                type="checkbox"
                value={formData.parking}
                id="parking"
                name="parking"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group col-sm-6">
            <label htmlFor="otherNotes">Other Notes:</label>
            <textarea
              id="otherNotes"
              name="otherNotes"
              value={formData.otherNotes}
              onChange={handleChange}
              rows={3}
              className="form-control"
            />
          </div>
        </div>

        <div className="form-group col-12">
          <label htmlFor="stars">Stars:</label>
          <input
            className="stars"
            type="range"
            max={5}
            onChange={handleChange}
            value={+formData.stars}
            style={{ "--value": 0 }}
            step={1}
            id="stars"
            name="stars"
          />
        </div>
        <button className="btn btn-success">Submit</button>
      </form>
    </div>
  );
};

export default ReviewForm;
