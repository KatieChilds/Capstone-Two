import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import CurrUserContext from "./CurrUserContext";
import PlacesCard from "./PlacesCard";

const PlacesCardList = () => {
  const { currUserParsed, getPlaces, removePlace } =
    useContext(CurrUserContext);
  const [places, setPlaces] = useState([]);
  const [isRemoved, setIsRemoved] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    getPlacesOnMount();
  }, []);

  async function getPlacesOnMount() {
    const res = await getPlaces(currUserParsed.username);
    if (!res.success) {
      setErrors((errs) => [...errs, res.errors]);
      return errors;
    }
    setPlaces(res.places);
  }

  useEffect(() => {
    getPlacesOnMount();
    setIsRemoved(false);
  }, [isRemoved]);

  const handleRemove = async (id) => {
    const removeResult = await removePlace(id);
    if (!removeResult.success) {
      setErrors((errs) => [...errs, removeResult.errors]);
      return errors;
    }
    setIsRemoved(true);
  };

  return (
    <div className="PlacesCardList">
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
      {places.length !== 0 ? (
        <div className="row g-3 ms-3 me-3 mt-1 justify-content-md-center">
          {places.map((place) => (
            <PlacesCard
              place={place}
              key={place.id}
              handleRemove={handleRemove}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default PlacesCardList;
