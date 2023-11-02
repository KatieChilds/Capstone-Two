import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import CurrUserContext from "./CurrUserContext";
import { Loader } from "@googlemaps/js-api-loader";
import SearchForm from "./SearchForm";
import axios from "axios";
import "./UserMap.css";
require("dotenv").config();
const GOOGLE_API_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const UserMap = () => {
  const { currUserParsed, getPlaces, token } =
    useContext(CurrUserContext);
  const [places, setPlaces] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [errors, setErrors] = useState([]);
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const lat = +currUserParsed.lat;
  const lng = +currUserParsed.lng;
  const location = useMemo(
    () => ({ lat, lng }),
    [lat, lng]
  );
  console.log("PLACES: ", places);

  const initMap = useCallback(
    (place = places) => {
      let map;

      const loader = new Loader({
        apiKey: GOOGLE_API_KEY,
        version: "quarterly",
        libraries: ["places"],
      });

      loader
        .importLibrary("maps")
        .then(({ Map }) => {
          map = new Map(document.getElementById("map"), {
            center: location,
            zoom: 10,
            mapId: "USER_MAP",
          });
          if (Array.isArray(place) && place.length > 0) {
            for (let i = 0; i < place.length; i++) {
              addMarker(place[i]);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });

      function addMarker(data) {
        let marker;
        let infoWindow;

        let lat = +data.lat;
        let lng = +data.lng;
        let name = data.name;
        let id = data.id;
        let type = data.type;

        let contentString = `<p><strong>Name:</strong> ${name}, <strong>Type:</strong> ${type}</p><br>
          <a href='/places/${id}' className='btn btn-secondary'>Get Details</a>`;

        loader.importLibrary("core");

        loader
          .importLibrary("maps")
          .then(({ InfoWindow }) => {
            infoWindow = new InfoWindow({
              content: contentString,
              position: { lat, lng },
            });
          })
          .catch((err) => {
            console.log(err);
          });

        loader
          .importLibrary("marker")
          .then(({ AdvancedMarkerElement }) => {
            marker = new AdvancedMarkerElement({
              position: {
                lat,
                lng,
              },
              map,
              title: name,
            });
            map.setCenter({ lat, lng });
            marker.addListener("click", () => {
              infoWindow.open({
                map,
                anchor: marker,
              });
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    [location, places]
  );

  useEffect(() => {
    async function getPlacesOnMount() {
      const res = await getPlaces(currUserParsed.username);
      if (!res.success) {
        setErrors((errs) => [...errs, res.errors]);
        return errors;
      }
      setPlaces(res.places);
      setForceUpdate((prev) => prev + 1);
    }
    getPlacesOnMount();
  }, []);

  useEffect(() => {
    initMap();
  }, [forceUpdate]);

  async function searchFor(searchObj) {
    const res = await axios.post(
      `${BASE_URL}/users/place/search`,
      {
        ...searchObj,
        lat: currUserParsed.lat,
        lng: currUserParsed.lng,
      },
      { headers: headers }
    );
    console.log("RES for search: ", res.data.place);
    let lat = +res.data.place.lat;
    let lng = +res.data.place.lng;
    let name = res.data.place.name;
    let type = res.data.place.type;
    let id = res.data.place.id;
    let place = { name, lat, lng, type, id };
    console.log("PLACE from res: ", place);
    setPlaces([...places, place]);
    setForceUpdate((prev) => prev + 1);
  }

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
      <SearchForm
        keyVal="searchName"
        searchFor={searchFor}
      />
      <div
        className="map-container"
        id="map"
      ></div>
    </div>
  );
};

export default UserMap;
