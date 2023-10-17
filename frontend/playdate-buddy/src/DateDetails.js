import React, {
  useEffect,
  useState,
  useContext,
} from "react";
import { useParams } from "react-router-dom";
import CurrUserContext from "./CurrUserContext";

const DateDetails = () => {
  const { id, date } = useParams();
  console.log("ID", id);
  console.log("date", date);
  const { getDateInfo } = useContext(CurrUserContext);
  const [dateInfo, setDateInfo] = useState({});

  useEffect(() => {
    async function getDateDetailsOnMount() {
      try {
        const dateRes = await getDateInfo(id, date);
        setDateInfo(dateRes.data.date);
      } catch (err) {
        console.log(err);
      }
    }
    getDateDetailsOnMount();
  }, []);

  console.log(dateInfo);
  return (
    <div>
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
