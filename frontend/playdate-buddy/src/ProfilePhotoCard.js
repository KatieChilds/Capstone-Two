import React, { useContext } from "react";
import CurrUserContext from "./CurrUserContext";

const ProfilePhotoCard = () => {
  const { currUserParsed } = useContext(CurrUserContext);

  return (
    <div>
      <img
        src={currUserParsed.avatar}
        alt="profile avatar"
        className="avatar"
      />
    </div>
  );
};

export default ProfilePhotoCard;
