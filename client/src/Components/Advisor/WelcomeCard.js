import React from "react";
import { useSelector } from "react-redux";

const WelcomeCard = () => {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="welcome-banner">
      <h1>Welcome Back, {user?.firstName?.toUpperCase()}!</h1>
    </div>
  );
};

export default WelcomeCard;
