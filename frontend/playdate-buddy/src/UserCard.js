import React, {
  useState,
  useContext,
  useEffect,
} from "react";
import CurrUserContext from "./CurrUserContext";

const UserCard = ({ user }) => {
  const {
    addFriend,
    unfriend,
    getFriends,
    currUserParsed,
  } = useContext(CurrUserContext);
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

  const handleClick = async () => {
    const friendResult = await addFriend(user.username);
    if (!friendResult.success) {
      setErrors((errs) => [...errs, friendResult.errors]);
      return errors;
    }
    const friends = await getFriends(
      currUserParsed.username
    );
    setFriends(friends.friends);
  };

  const handleUnfriend = async () => {
    const unfriendResult = await unfriend(user.username);
    if (!unfriendResult.success) {
      setErrors((errs) => [...errs, unfriendResult.errors]);
      return errors;
    }
    const friends = await getFriends(
      currUserParsed.username
    );
    setFriends(friends.friends);
  };

  return (
    <div className="UserCard col-md-auto">
      <div className="card border-info my-2">
        <div className="card-header">{user.username}</div>
        <div className="card-body">
          <img
            src={user.avatar}
            alt="user's avatar"
            className="profile-avatar"
          />
          <p className="card-text">
            Name: {user.firstname}
          </p>
          {friends.includes(user.username) ? (
            <button
              className="btn btn-primary"
              onClick={handleUnfriend}
            >
              Unfriend
            </button>
          ) : (
            <button
              className="btn btn-info"
              onClick={handleClick}
            >
              Add Friend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
