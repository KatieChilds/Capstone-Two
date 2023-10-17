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
  const navigate = useNavigate();

  useEffect(() => {
    getDatesOnMount();
  }, []);

  async function getDatesOnMount() {
    try {
      const dateResults = await getDates();
      setDates(dateResults);
    } catch (err) {
      console.log(err);
    }
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
    await cancelDate(id, date);
    setIsDeleted(true);
  };

  const formatDate = (date) => {
    return moment(date).format(
      "dddd, MMMM Do YYYY, h:mm:ss a"
    );
  };

  return (
    <div>
      {dates.length !== 0 ? (
        <>
          {dates.map((date) => (
            <div
              className="card border-primary mb-3"
              key={uuid()}
            >
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
          ))}
        </>
      ) : (
        <p>No playdates made</p>
      )}
    </div>
  );
};

export default DatesList;
