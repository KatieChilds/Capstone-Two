import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import ProfilePage from "./ProfilePage";
import FriendsList from "./FriendsList";
import UserMap from "./UserMap";
import PlacesCardList from "./PlacesCardList";
import PlacesDetail from "./PlacesDetail";
import ProfileForm from "./ProfileForm";
import AddChildForm from "./AddChildForm";
import ReviewForm from "./ReviewForm";
import UsersCardList from "./UsersCardList";
import DatesList from "./DatesList";
import DateDetails from "./DateDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/map"
        element={<UserMap />}
      />
      <Route
        path="/places/:id/review"
        element={<ReviewForm />}
      />
      <Route
        path="/places/:id"
        element={<PlacesDetail />}
      />
      <Route
        path="/places"
        element={<PlacesCardList />}
      />
      <Route
        path="/users"
        element={<UsersCardList />}
      />
      <Route
        path="/friends"
        element={<FriendsList />}
      />
      <Route
        path="/login"
        element={<LoginForm />}
      />
      <Route
        path="/signup"
        element={<SignupForm />}
      />
      <Route
        path="/profile/update"
        element={<ProfileForm />}
      />
      <Route
        path="/profile"
        element={<ProfilePage />}
      />
      <Route
        path="/addChild"
        element={<AddChildForm />}
      />
      <Route
        path="/dates/:id/:date"
        element={<DateDetails />}
      />
      <Route
        path="/dates"
        element={<DatesList />}
      />
    </Routes>
  );
};

export default AppRoutes;
