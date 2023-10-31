import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import UserCard from "./UserCard";
import CurrUserContext from "./CurrUserContext";

const UsersCardList = () => {
  const { currUserParsed, getUsers } =
    useContext(CurrUserContext);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState([]);

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

  return (
    <div className="UsersCardlist">
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
      {users.length !== 0 ? (
        <div className="row g-3 ms-3 me-3 mt-1 justify-content-md-center">
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
