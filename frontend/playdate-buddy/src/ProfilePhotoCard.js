import React, { useContext } from "react";
import CurrUserContext from "./CurrUserContext";

const ProfilePhotoCard = () => {
  const { currUser } = useContext(CurrUserContext);

  return (
    <div>
      <img
        src={currUser.avatar}
        alt="profile avatar"
        className="avatar"
      />
    </div>
  );
};

export default ProfilePhotoCard;
