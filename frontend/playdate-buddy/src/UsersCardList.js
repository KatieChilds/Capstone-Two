import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import UserCard from "./UserCard";
import CurrUserContext from "./CurrUserContext";
import SearchForm from "./SearchForm";
import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const UsersCardList = () => {
  const { currUser, getUsers, token } =
    useContext(CurrUserContext);
  const [users, setUsers] = useState([]);
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    async function getUsersOnMount() {
      try {
        const res = await getUsers();
        console.log("RES", res);
        const filteredUsers = res.filter(
          (user) => user.username !== currUser.username
        );
        setUsers(filteredUsers);
      } catch (err) {
        console.log(err);
      }
    }
    getUsersOnMount();
  }, [getUsers, currUser.username]);

  async function searchFor(searchObj) {
    const res = await axios.get(
      `${BASE_URL}/users`,
      searchObj,
      { headers: headers }
    );
    const usersRes = res.filter(
      (user) => user.username !== currUser.username
    );
    setUsers(usersRes);
  }

  console.log("USERS", users);
  return (
    <div className="UsersCardlist">
      <SearchForm
        keyVal="gender"
        searchFor={searchFor}
      />
      {users.length !== 0 ? (
        <div className="List">
          {users.map((user) => (
            <UserCard
              user={user}
              key={user.username}
            />
          ))}
        </div>
      ) : (
        <h4 className="mt-4 text-success">
          <em>~ No users ~</em>
        </h4>
      )}
    </div>
  );
};
export default UsersCardList;
