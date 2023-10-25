import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import UserCard from "./UserCard";
import CurrUserContext from "./CurrUserContext";
// import SearchForm from "./SearchForm";
// import axios from "axios";

// const BASE_URL =
//   process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const UsersCardList = () => {
  const { currUserParsed, getUsers } =
    useContext(CurrUserContext);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);
  // const headers = {
  //   Authorization: `Bearer ${token}`,
  // };

  useEffect(() => {
    async function getUsersOnMount() {
      const res = await getUsers();
      if (!res.success) {
        setErrors((errs) => [...errs, res.errors]);
        return errors;
      }
      const filteredUsers = res.users.filter(
        (user) => user.username !== currUserParsed.username
      );
      setUsers(filteredUsers);
    }
    getUsersOnMount();
  }, [getUsers, currUserParsed.username, errors]);

  // async function searchFor(searchObj) {
  //   const res = await axios.get(
  //     `${BASE_URL}/users`,
  //     searchObj,
  //     { headers: headers }
  //   );
  //   if (!res.success) {
  //     setErrors((errs) => [...errs, res.errors]);
  //     return errors;
  //   }
  //   const usersRes = res.filter(
  //     (user) => user.username !== currUserParsed.username
  //   );
  //   setUsers(usersRes);
  // }

  return (
    <div className="UsersCardlist">
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
      {users.length !== 0 ? (
        <div className="List">
          {users.map((user) => (
            <UserCard
              user={user}
              key={user.username}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default UsersCardList;
