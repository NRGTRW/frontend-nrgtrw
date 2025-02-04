import React from "react";
import { Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import LoadingPage from "../pages/LoadingPage";
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  return user ? children : <Navigate to="/login" state={{ from: location }} replace />;
};
export default PrivateRoute;
