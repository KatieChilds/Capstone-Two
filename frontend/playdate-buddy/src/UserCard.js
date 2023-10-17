import React, { useState, useContext } from "react";
import CurrUserContext from "./CurrUserContext";

const UserCard = ({ user }) => {
  const { addFriend, unfriend } =
    useContext(CurrUserContext);
  const [friendStatus, setFriendStatus] = useState(false);

  const handleClick = async () => {
    addFriend(user.username);
    setFriendStatus(true);
  };

  const handleUnfriend = async () => {
    unfriend(user.username);
    setFriendStatus(false);
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
