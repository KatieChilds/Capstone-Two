import React, { useContext } from "react";
import CurrUserContext from "./CurrUserContext";
import { useParams } from "react-router-dom";

const ReviewsCard = ({ review, handleDelete }) => {
  const { currUser } = useContext(CurrUserContext);
  const content = review.content;
  const numStars = review.stars;

  return (
    <div className="ReviewCard-card">
      <div className="card-header">
        Review from: {review.user}
      </div>
      <div className="card-body">
        <h6 className="card-title">
          {[...Array(numStars)].map((e, i) => (
            <i
              className="fa-solid fa-star text-warning"
              key={i}
            ></i>
          ))}
        </h6>
        <p>From: {review.date}</p>
        <div>
          <small>
            <p>
              Bathroom:{" "}
              {content.bathroom ? (
                <i className="fa-solid fa-square-check text-success"></i>
              ) : (
                <i className="fa-solid fa-square-xmark text-danger"></i>
              )}
            </p>
            <p>
              Changing Table:{" "}
              {content.changingTable ? (
                <i className="fa-solid fa-square-check text-success"></i>
              ) : (
                <i className="fa-solid fa-square-xmark text-danger"></i>
              )}
            </p>
            <p>
              Highchair:{" "}
              {content.highchair ? (
                <i className="fa-solid fa-square-check text-success"></i>
              ) : (
                <i className="fa-solid fa-square-xmark text-danger"></i>
              )}
            </p>
            <p>
              Parking:{" "}
              {content.parking ? (
                <i className="fa-solid fa-square-check text-success"></i>
              ) : (
                <i className="fa-solid fa-square-xmark text-danger"></i>
              )}
            </p>
            <p>Other Notes: {content.otherNotes}</p>
          </small>
        </div>
        {currUser.username === review.user ? (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(review.user)}
          >
            Delete Review
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ReviewsCard;
