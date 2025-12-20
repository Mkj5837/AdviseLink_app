import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, userType }) => {
  // Read authenticated user from Redux store (persisted via redux-persist)
  const user = useSelector((state) => state.user.user);

  // Not authenticated -> redirect to login
  if (!user) return <Navigate to="/login" replace />;

  // If a specific role is required, check `user.userType`
  if (userType && user.userType !== userType)
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
