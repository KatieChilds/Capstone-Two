import React, { useState, useContext } from "react";
import CurrUserContext from "./CurrUserContext";

const UserCard = ({ user }) => {
  const { addFriend, unfriend } =
    useContext(CurrUserContext);
  const [friendStatus, setFriendStatus] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleClick = async () => {
    const friendResult = await addFriend(user.username);
    if (!friendResult.success) {
      setErrors((errs) => [...errs, friendResult.errors]);
      return errors;
    }
    setFriendStatus(true);
    return (
      <alert>
        <p>{friendResult.friend}</p>
      </alert>
    );
  };

  const handleUnfriend = async () => {
    const unfriendResult = await unfriend(user.username);
    if (!unfriendResult.success) {
      setErrors((errs) => [...errs, unfriendResult.errors]);
      return errors;
    }
    setFriendStatus(false);
    return (
      <alert>
        <p>{unfriendResult.msg}</p>
      </alert>
    );
  };

  return (
    <div className="UserCard">
      <div className="card border-info my-2">
        <div className="card-header">{user.username}</div>
        <div className="card-body">
          <img
            src={user.avatar}
            alt="user's avatar"
          />
          <p className="card-text">
            Name: {user.firstname}
          </p>
          {friendStatus ? (
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
