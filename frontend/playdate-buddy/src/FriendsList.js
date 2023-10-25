import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import CurrUserContext from "./CurrUserContext";

const FriendsList = () => {
  const { currUserParsed, getFriends, unfriend } =
    useContext(CurrUserContext);
  const [friends, setFriends] = useState([]);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function getFriendssOnMount() {
      const res = await getFriends(currUserParsed.username);
      if (!res.success) {
        setErrors((errs) => [...errs, res.errors]);
        return errors;
      }

      setFriends(res.friends);
    }
    getFriendssOnMount();
  }, [getFriends, currUserParsed.username, errors]);

  const handleClick = async (friend) => {
    const unfriendResult = unfriend(friend);
    if (!unfriendResult.success) {
      setErrors((errs) => [...errs, unfriendResult.errors]);
      return errors;
    }
    setFriends(friends.filter((f) => f !== friend));
    return (
      <alert>
        <p>{unfriendResult.msg}</p>
      </alert>
    );
  };

  return (
    <div className="FriendsCardlist">
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
      {friends.length !== 0 ? (
        <div className="list">
          <h3>Friends</h3>
          <ul>
            {friends.map((friend) => (
              <li key={friend}>
                {friend}
                <button
                  className="btn btn-danger btn-sm mx-3"
                  onClick={() => handleClick(friend)}
                >
                  Unfriend
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};
export default FriendsList;
