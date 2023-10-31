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
import "./PlacesDetail.css";

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
    getPlaces,
  } = useContext(CurrUserContext);
  const [place, setPlace] = useState({});
  const [dates, setDates] = useState([]);
  const [saved, setSaved] = useState([]);
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
    // Fetch place data based on id
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
    // Fetch date data for the place
    try {
      let dateRes = await axios.get(
        `${BASE_URL}/users/places/${id}/dates`,
        { headers }
      );
      const groupedUsernames = new Map();

      // Iterate through the 'dates' array
      for (const date of dateRes.data.dates) {
        // Create a unique key based on place and date
        const key = `${date.place}_${date.date}`;

        // Check if the key already exists in the map, if not, initialize it with an empty array
        if (!groupedUsernames.has(key)) {
          groupedUsernames.set(key, []);
        }

        // Push the username to the array associated with the key
        groupedUsernames.get(key).push(date.username);
      }

      // Convert the map values to an array of objects
      const groupedUsernamesArray = [
        ...groupedUsernames.entries(),
      ].map(([key, usernames]) => {
        const [place, date] = key.split("_");
        return { place, date, usernames };
      });
      setDates(groupedUsernamesArray);
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        setErrors((e) => [...e, ...errs]);
      } else {
        setErrors((e) => [
          ...e,
          err.response.data.error.message,
        ]);
      }
    }
    // Fetch saved places for the current user
    try {
      const userPlaces = await getPlaces(
        currUserParsed.username
      );
      setSaved(userPlaces.places);
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
      return errors;
    }
    const userPlaces = await getPlaces(
      currUserParsed.username
    );
    setSaved(userPlaces.places);
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
  };

  const handleDelete = async (username) => {
    const reviewResult = await removeReview(username, id);
    if (!reviewResult.success) {
      setErrors((errs) => [...errs, reviewResult.errors]);
      return errors;
    }
    setReviewDeleted(true);
  };

  useEffect(() => {}, [errors]);

  return (
    <div className="placesDetails">
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
                disabled={saved.some(
                  (place) => place.id === id
                )}
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
          <div className="row">
            {place.reviews.length !== 0 ? (
              <div className="reviews-container col">
                <h4>Reviews:</h4>
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
              <div className="dates-container col">
                <h4>Scheduled Playdates:</h4>
                {dates.map((date) => (
                  <div
                    className="card border-warning mb-3"
                    key={uuid()}
                  >
                    <div className="card-body">
                      <p className="card-text">
                        Who:{" "}
                        {date.usernames.length > 1
                          ? date.usernames.join(", ")
                          : date.usernames[0]}
                      </p>
                      <p className="card-text">
                        When:{" "}
                        {moment(date.date).format(
                          "dddd, MMMM Do YYYY, h:mm:ss a"
                        )}
                      </p>
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          handleJoin(date.date)
                        }
                        disabled={
                          date.usernames.includes(
                            currUserParsed.username
                          ) || disabled
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
        </div>
      ) : (
        <div>Loading Place Details...</div>
      )}
    </div>
  );
};

export default PlacesDetail;
