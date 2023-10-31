import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import CurrUserContext from "./CurrUserContext";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DatesList = () => {
  const { getDates, cancelDate } =
    useContext(CurrUserContext);
  const [dates, setDates] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDatesOnMount();
  }, []);

  async function getDatesOnMount() {
    const dateResults = await getDates();
    if (!dateResults.success) {
      setErrors((errs) => [...errs, dateResults.errors]);
      return errors;
    }
    setDates(dateResults.dates);
  }

  useEffect(() => {
    if (isDeleted) {
      getDatesOnMount();
      setIsDeleted(false);
    }
  }, [isDeleted]);

  const handleClick = async (id, date) => {
    navigate(`/dates/${id}/${date}`);
  };

  const handleCancel = async (id, date) => {
    const cancelResult = await cancelDate(id, date);
    if (!cancelResult.success) {
      setErrors((errs) => [...errs, cancelResult.errors]);
      return errors;
    }
    setIsDeleted(true);
    return (
      <alert>
        <p>{cancelResult.msg}</p>
      </alert>
    );
  };

  const formatDate = (date) => {
    return moment(date).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
  };

  return (
    <div>
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
      {dates.length !== 0 ? (
        <div className="row g-3 ms-3 me-3 mt-1 justify-content-md-center">
          {dates.map((date) => (
            <div
              className="col"
              key={uuid()}
            >
              <div className="card border-primary mb-3">
                <div className="card-header">Playdate</div>
                <div className="card-body">
                  <p className="card-text">
                    Where: {date.name}
                  </p>
                  <p className="card-text">
                    When: {formatDate(date.date)}
                  </p>
                  <button
                    className="btn btn-info btn-sm mx-2"
                    onClick={() =>
                      handleClick(date.id, date.date)
                    }
                  >
                    Get Info
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() =>
                      handleCancel(date.id, date.date)
                    }
                  >
                    Cancel Date
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default DatesList;
