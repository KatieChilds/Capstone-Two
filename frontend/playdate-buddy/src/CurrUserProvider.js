import React, { useEffect, useMemo } from "react";
import CurrUserContext from "./CurrUserContext";
import useLocalStorage from "./useLocalStorage";
import jwt from "jsonwebtoken";
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";
const TOKEN_STORAGE_ID = "playdate-buddy-token";
const USER_STORAGE_ID = "playdate-buddy-user";

const CurrUserProvider = ({ children }) => {
  const [currUser, setCurrUser] =
    useLocalStorage(USER_STORAGE_ID);
  const currUserParsed = JSON.parse(currUser);
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
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/token`,
        {
          ...user,
        },
        { headers: headers }
      );
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
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

            setCurrUser(JSON.stringify(userInfo));
          } catch (err) {
            if (
              Array.isArray(err.response.data.error.message)
            ) {
              const errs =
                err.response.data.error.message.map(
                  (e) => e
                );
              setCurrUser(null);
              return { success: false, errors: errs };
            } else {
              setCurrUser(null);
              return {
                success: false,
                errors: err.response.data.error.message,
              };
            }
          }
        }
      }
      getCurrentUser();
    },
    [token, headers, setCurrUser]
  );

  const signup = async (user) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/register`,
        { ...user },
        { headers: headers }
      );
      setToken(res.data.token);
      return { success: true };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const logout = () => {
    setCurrUser(null);
    setToken("");
  };

  const deleteUser = async () => {
    try {
      const msg = await axios.delete(
        `${BASE_URL}/users/${currUserParsed.username}`,
        { headers }
      );
      setCurrUser(null);
      setToken("");
      return { success: true, msg };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`, {
        headers,
      });
      return { success: true, users: res.data.users };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const getPlaces = async (username) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/${username}/places`,
        { headers: headers }
      );
      return { success: true, places: res.data.places };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const addChild = async (data) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/${currUserParsed.username}/children/add`,
        { ...data },
        { headers: headers }
      );
      return { success: true, children: res.data.children };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const getFriends = async (username) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/${username}/friends`,
        { headers }
      );
      return { success: true, friends: res.data.friends };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const addFriend = async (friend) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/${currUserParsed.username}/friends/${friend}/add`,
        null,
        { headers }
      );
      return { success: true, friend: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const unfriend = async (friend) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/${currUserParsed.username}/friends/${friend}/remove`,
        { headers }
      );
      return { success: true, msg: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const savePlace = async (id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}`,
        null,
        { headers: headers }
      );
      return { success: true, msg: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const removePlace = async (id) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}`,
        { headers }
      );
      return { success: true, msg: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const leaveReview = async (id, data) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}/review`,
        { ...data },
        { headers }
      );
      return { success: true, msg: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const removeReview = async (username, id) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/${username}/places/${id}/review`,
        { headers }
      );
      return { success: true, msg: res };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const makeDate = async (id, timestamp) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}/date`,
        { timestamp },
        { headers }
      );
      return { success: true, msg: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const getDates = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/${currUserParsed.username}/dates`,
        { headers }
      );
      return { success: true, dates: res.data.dates };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const cancelDate = async (id, date) => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}/date`,
        { headers, data: { timestamp: date } }
      );
      return { success: true, msg: res };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  const getDateInfo = async (id, date) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/users/${currUserParsed.username}/places/${id}/date`,
        { params: { timestamp: date }, headers }
      );
      return { success: true, date: res.data };
    } catch (err) {
      if (Array.isArray(err.response.data.error.message)) {
        const errs = err.response.data.error.message.map(
          (e) => e
        );
        return { success: false, errors: errs };
      } else {
        return {
          success: false,
          errors: err.response.data.error.message,
        };
      }
    }
  };

  return (
    <CurrUserContext.Provider
      value={{
        currUserParsed,
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
