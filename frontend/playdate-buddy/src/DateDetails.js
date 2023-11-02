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
      console.log(
        "DATE RES in component: ",
        dateRes.date.date
      );
      setDateInfo(dateRes.date.date);
      console.log("DATE INFO from state: ", dateInfo);
    }
    getDateDetailsOnMount();
  }, [date, errors, getDateInfo, id]);

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
      <h4>Date Info:</h4>
      <p>Where: {dateInfo.where}</p>
      <p>When: {dateInfo.when}</p>
      {dateInfo.with ? (
        <ul style={{ width: "fit-content" }}>
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
