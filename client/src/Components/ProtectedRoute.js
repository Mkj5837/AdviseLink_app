import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, userType }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (userType && user.type !== userType) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
