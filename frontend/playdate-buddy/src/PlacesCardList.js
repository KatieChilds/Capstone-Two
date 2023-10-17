import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import CurrUserContext from "./CurrUserContext";
import PlacesCard from "./PlacesCard";

const PlacesCardList = () => {
  const { currUser, getPlaces, removePlace } =
    useContext(CurrUserContext);
  const [places, setPlaces] = useState([]);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    console.log("useEffect running on mount");
    getPlacesOnMount();
    console.log("places data on mount:", places);
  }, []);

  async function getPlacesOnMount() {
    try {
      const res = await getPlaces(currUser.username);
      setPlaces(res);
      console.log(
        "get places run with data returned:",
        res
      );
    } catch (err) {
      console.log(err);
      if (err.response.status === 404) setPlaces([]);
      console.log("status code", err.response.status);
    }
  }

  useEffect(() => {
    console.log(
      "useEffect is running due to remove change"
    );
    getPlacesOnMount();
    console.log("places data in second useEffect:", places);
    setIsRemoved(false);
  }, [isRemoved]);

  const handleRemove = async (id) => {
    await removePlace(id);
    console.log("remove button was clicked");
    setIsRemoved(true);
  };

  return (
    <div className="PlacesCardList">
      {places.length !== 0 ? (
        <div className="List">
          {places.map((place) => (
            <PlacesCard
              place={place}
              key={place.id}
              handleRemove={handleRemove}
            />
          ))}
        </div>
      ) : (
        <h4 className="mt-4 text-success">
          <em>~ No saved places ~</em>
        </h4>
      )}
    </div>
  );
};

export default PlacesCardList;
