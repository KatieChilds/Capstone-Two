import React, {
  useContext,
  useState,
  useEffect,
} from "react";
import CurrUserContext from "./CurrUserContext";

const FriendsList = () => {
  const { currUser, getFriends, unfriend } =
    useContext(CurrUserContext);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    async function getFriendssOnMount() {
      try {
        const res = await getFriends(currUser.username);
        setFriends(res);
      } catch (err) {
        console.log(err);
      }
    }
    getFriendssOnMount();
  }, [getFriends, currUser.username]);

  const handleClick = (friend) => {
    unfriend(friend);
    setFriends(friends.filter((f) => f !== friend));
  };

  return (
    <div className="FriendsCardlist">
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
      ) : (
        <h4 className="mt-4 text-success">
          <em>~ No friends ~</em>
        </h4>
      )}
    </div>
  );
};
export default FriendsList;
