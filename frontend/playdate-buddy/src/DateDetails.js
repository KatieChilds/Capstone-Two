import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";

const DateDetails = () => {
  const { id, date } = useParams();
  const { getDateInfo } = useContext(CurrUserContext);
  const [dateInfo, setDateInfo] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getDateDetailsOnMount() {
      const dateRes = await getDateInfo(id, date);
      if (!dateRes.success) {
        setErrors((errs) => [...errs, dateRes.errors]);
        return errors;
      }
      setDateInfo(dateRes.date);
    }
    getDateDetailsOnMount();
  }, [date, errors, getDateInfo, id]);

  return (
    <div>
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
      <h5>Date Info:</h5>
      <p>Where: {dateInfo.where}</p>
      <p>When: {dateInfo.when}</p>
      {dateInfo.with ? (
        <ul>
          Who:
          {dateInfo.with.map((w) => (
            <li key={w.username}>{w.username}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default DateDetails;
