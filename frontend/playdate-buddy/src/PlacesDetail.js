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
    currUser,
    removeReview,
  } = useContext(CurrUserContext);
  const [place, setPlace] = useState({});
  const [dates, setDates] = useState([]);
  const [savedStatus, setSavedStatus] = useState(false);
  const [placeLoaded, setPlaceLoaded] = useState(false);
  const [click, setClick] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [reviewDeleted, setReviewDeleted] = useState(false);
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  useEffect(() => {
    fetchPlace();
    console.log("place loaded?", placeLoaded);
    console.log("PLACE on mount", place);
  }, []);

  async function fetchPlace() {
    try {
      let res = await axios.get(
        `${BASE_URL}/users/places/${id}`,
        { headers: headers }
      );
      setPlace(res.data.place);
      console.log(
        "results in fetch place are:",
        res.data.place
      );
      setPlaceLoaded(true);
      console.log(
        "place loaded in fetch place?",
        placeLoaded
      );
      console.log("PLACE in fetch place", place);
    } catch (err) {
      console.log(err);
    }
    try {
      let dateRes = await axios.get(
        `${BASE_URL}/users/places/${id}/dates`,
        { headers }
      );
      setDates(dateRes.data.dates);
    } catch (err) {
      console.log(err);
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

  const handleSave = async (e) => {
    savePlace(id);
    setSavedStatus(true);
  };

  const handleClick = () => {
    setClick(true);
  };

  const handleJoin = async (date) => {
    await makeDate(id, date);
    setDisabled(true);
  };

  const handleDelete = (username) => {
    removeReview(username, id);
    setReviewDeleted(true);
  };

  return (
    <div className="placesDetails">
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
                        currUser.username ===
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
