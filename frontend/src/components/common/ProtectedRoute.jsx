import React from "react";
import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps pages that require authentication.
 * If no valid token is found in localStorage, redirects to /login.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
