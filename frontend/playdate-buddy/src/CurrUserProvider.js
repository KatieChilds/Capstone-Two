import React, { useState, useEffect, useMemo } from "react";
import CurrUserContext from "./CurrUserContext";
import useLocalStorage from "./useLocalStorage";
import jwt from "jsonwebtoken";
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const TOKEN_STORAGE_ID = "playdate-buddy-token";

const CurrUserProvider = ({ children }) => {
  const [currUser, setCurrUser] = useState(null);
  const [token, setToken] = useLocalStorage(
    TOKEN_STORAGE_ID
  );
  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  const login = async (user) => {
    const res = await axios.post(
      `${BASE_URL}/auth/token`,
      {
        ...user,
      },
      { headers: headers }
    );
    setToken(res.data.token);
    setCurrUser(user);
  };

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username, access_token } =
              jwt.decode(token);
            let user = await axios.get(
              `${BASE_URL}/users/${username}`,
              { headers: headers }
            );

            let userInfo = {
              ...user.data.user,
              access_token,
            };

            setCurrUser(userInfo);
          } catch (err) {
            setCurrUser(null);
          }
        }
      }
      getCurrentUser();
    },
    [token, headers]
  );

  const signup = async (user) => {
    const res = await axios.post(
      `${BASE_URL}/auth/register`,
      { ...user },
      { headers: headers }
    );
    setToken(res.data.token);
  };

  const logout = () => {
    setCurrUser(null);
    setToken("");
  };

  const deleteUser = async () => {
    await axios.delete(
      `${BASE_URL}/users/${currUser.username}`,
      { headers }
    );
    setCurrUser(null);
    setToken("");
  };

  const getUsers = async () => {
    const res = await axios.get(`${BASE_URL}/users`, {
      headers,
    });
    return res.data.users;
  };

  const getPlaces = async (username) => {
    const res = await axios.get(
      `${BASE_URL}/users/${username}/places`,
      { headers: headers }
    );
    return res.data.places;
  };

  const addChild = async (data) => {
    const res = await axios.post(
      `${BASE_URL}/users/${currUser.username}/children/add`,
      { ...data },
      { headers: headers }
    );

    console.log(
      "RES from add child method",
      res.data.children
    );
    return res.data.children;
  };

  const getFriends = async (username) => {
    const res = await axios.get(
      `${BASE_URL}/users/${username}/friends`,
      { headers }
    );
    return res.data.friends;
  };

  const addFriend = async (friend) => {
    console.log("currUser", currUser.username);
    console.log("Friend", friend);
    const res = await axios.post(
      `${BASE_URL}/users/${currUser.username}/friends/${friend}/add`,
      null,
      { headers }
    );
    return res.data;
  };

  const unfriend = async (friend) => {
    const res = await axios.delete(
      `${BASE_URL}/users/${currUser.username}/friends/${friend}/remove`,
      { headers }
    );
    return res.data;
  };

  const savePlace = async (id) => {
    const res = await axios.post(
      `${BASE_URL}/users/${currUser.username}/places/${id}`,
      null,
      { headers: headers }
    );
    return res;
  };

  const removePlace = async (id) => {
    const res = await axios.delete(
      `${BASE_URL}/users/${currUser.username}/places/${id}`,
      { headers }
    );
    return res;
  };

  const leaveReview = async (id, data) => {
    const res = await axios.post(
      `${BASE_URL}/users/${currUser.username}/places/${id}/review`,
      { ...data },
      { headers }
    );
    return res;
  };

  const removeReview = async (username, id) => {
    const res = await axios.delete(
      `${BASE_URL}/users/${username}/places/${id}/review`,
      { headers }
    );
    return res;
  };

  const makeDate = async (id, timestamp) => {
    const res = await axios.post(
      `${BASE_URL}/users/${currUser.username}/places/${id}/date`,
      { timestamp },
      { headers }
    );
    return res.data;
  };

  const getDates = async () => {
    const res = await axios.get(
      `${BASE_URL}/users/${currUser.username}/dates`,
      { headers }
    );
    return res.data.dates;
  };

  const cancelDate = async (id, date) => {
    const res = await axios.delete(
      `${BASE_URL}/users/${currUser.username}/places/${id}/date`,
      { headers, data: { timestamp: date } }
    );
    return res;
  };

  const getDateInfo = async (id, date) => {
    console.log("DATE IN CURR USER METHOD", date);
    const res = await axios.get(
      `${BASE_URL}/users/${currUser.username}/places/${id}/date`,
      { params: { timestamp: date }, headers }
    );
    return res;
  };

  return (
    <CurrUserContext.Provider
      value={{
        currUser,
        setCurrUser,
        token,
        login,
        signup,
        logout,
        deleteUser,
        getUsers,
        addFriend,
        unfriend,
        getPlaces,
        addChild,
        getFriends,
        savePlace,
        removePlace,
        leaveReview,
        removeReview,
        makeDate,
        getDates,
        cancelDate,
        getDateInfo,
      }}
    >
      {children}
    </CurrUserContext.Provider>
  );
};

export default CurrUserProvider;
