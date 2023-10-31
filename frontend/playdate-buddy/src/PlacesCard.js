import React from "react";
import { useNavigate } from "react-router-dom";

const PlacesCard = ({ place, handleRemove }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/places/${place.id}`);
  };

  const handleClickRemove = () => {
    handleRemove(place.id);
  };

  return (
    <div
      className="placeCard col-md-auto"
      key={place.id}
    >
      <p>
        {place.name} - {place.type}
      </p>
      <button
        onClick={handleClick}
        className="btn btn-info btn-sm"
      >
        Show Details
      </button>
      <button
        onClick={handleClickRemove}
        className="btn btn-danger btn-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default PlacesCard;
