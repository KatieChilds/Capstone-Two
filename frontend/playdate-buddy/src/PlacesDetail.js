import React, {
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";
import CurrUserContext from "./CurrUserContext";
import { useParams, Link } from "react-router-dom";
import ReviewsCard from "./ReviewsCard";
import axios from "axios";
import moment from "moment";
import { v4 as uuid } from "uuid";
import DateForm from "./DateForm";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const PlacesDetail = () => {
  const { id } = useParams();
  const {
    token,
    savePlace,
    makeDate,
    currUserParsed,
    removeReview,
  } = useContext(CurrUserContext);
  const [place, setPlace] = useState({});
  const [dates, setDates] = useState([]);
  const [savedStatus, setSavedStatus] = useState(false);
  const [placeLoaded, setPlaceLoaded] = useState(false);
  const [click, setClick] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [reviewDeleted, setReviewDeleted] = useState(false);
  const [errors, setErrors] = useState([]);
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  useEffect(() => {
    fetchPlace();
  }, []);

  async function fetchPlace() {
    try {
      let res = await axios.get(
        `${BASE_URL}/users/places/${id}`,
        { headers: headers }
      );
      setPlace(res.data.place);
      setPlaceLoaded(true);
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        setErrors((e) => [...e, errs]);
      } else {
        setErrors((e) => [
          ...e,
          err.response.data.error.message,
        ]);
      }
    }
    try {
      let dateRes = await axios.get(
        `${BASE_URL}/users/places/${id}/dates`,
        { headers }
      );
      setDates(dateRes.data.dates);
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        setErrors((e) => [...e, ...errs]);
        return errors;
      } else {
        setErrors((e) => [
          ...e,
          err.response.data.error.message,
        ]);
        return errors;
      }
    }
  }

  useEffect(() => {
    if (reviewDeleted) fetchPlace();
    setReviewDeleted(false);
  }, [reviewDeleted]);

  useEffect(() => {
    if (disabled) fetchPlace();
    setDisabled(false);
  }, [disabled]);

  const handleSave = async () => {
    const savePlaceRes = await savePlace(id);
    if (!savePlaceRes.success) {
      setErrors((errs) => [...errs, savePlaceRes.errors]);
      console.log(savePlaceRes.errors);
      return errors;
    }
    setSavedStatus(true);
    return (
      <alert>
        <p>{savePlaceRes.msg}</p>
      </alert>
    );
  };

  const handleClick = () => {
    setClick(true);
  };

  const handleJoin = async (date) => {
    const dateResult = await makeDate(id, date);
    if (!dateResult.success) {
      setErrors((errs) => [...errs, dateResult.errors]);
      return errors;
    }
    setDisabled(true);
    return (
      <alert>
        <p>{dateResult.msg}</p>
      </alert>
    );
  };

  const handleDelete = async (username) => {
    const reviewResult = await removeReview(username, id);
    if (!reviewResult.success) {
      setErrors((errs) => [...errs, reviewResult.errors]);
      return errors;
    }
    setReviewDeleted(true);
    return (
      <alert>
        <p>{reviewResult.msg}</p>
      </alert>
    );
  };

  useEffect(() => {}, [errors]);

  return (
    <div className="placesDetails">
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
      {placeLoaded ? (
        <div className="place-container">
          <div className="card border-info mb-3">
            <div className="card-header">{place.name}</div>
            <div className="card-body">
              <p className="card-text">{place.address}</p>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  Type: {place.type}
                </li>
              </ul>
              <Link
                to={`/places/${id}/review`}
                className="btn btn-info mx-2"
              >
                Leave Review
              </Link>
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={savedStatus}
              >
                Save Place
              </button>
              <button
                id="playdate-btn"
                className="btn btn-primary mx-2"
                onClick={handleClick}
              >
                Make Playdate Here
              </button>
              {click ? <DateForm /> : null}
            </div>
          </div>
          {place.reviews.length !== 0 ? (
            <div className="reviews-container">
              {place.reviews.map((review) => (
                <ReviewsCard
                  review={review}
                  key={review.id}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <h4>No reviews</h4>
          )}
          {dates.length !== 0 ? (
            <div className="dates-container">
              <h4>Scheduled Playdates:</h4>
              {dates.map((date) => (
                <div
                  className="card border-warning mb-3"
                  key={uuid()}
                >
                  <div className="card-body">
                    <p className="card-text">
                      Who: {date.username}
                    </p>
                    <p className="card-text">
                      When:{" "}
                      {moment(date.date).format(
                        "dddd, MMMM Do YYYY, h:mm:ss a"
                      )}
                    </p>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleJoin(date.date)}
                      disabled={
                        currUserParsed.username ===
                          date.username || disabled
                      }
                    >
                      Join Playdate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <h4>No Playdates</h4>
          )}
        </div>
      ) : (
        <div>Loading Place Details...</div>
      )}
    </div>
  );
};

export default PlacesDetail;
