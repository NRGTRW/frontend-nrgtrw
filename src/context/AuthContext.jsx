/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import React, { createContext, useContext, useState } from "react";
import defaultProfilePicture from "../assets/images/default-profile.webp";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set true for testing
  const [user, setUser] = useState({
    profilePicture: defaultProfilePicture, // Default profile picture
    name: "John Doe",
    email: "john.doe@example.com",
    adress: "Optional",
    phone: "Optional",
  });

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser({
      profilePicture: defaultProfilePicture,
      name: "",
      email: "",
      adress: "",
      phone: "",
    });
  };

  const updateProfilePicture = (newProfilePicture) => {
    setUser((prevUser) => ({
      ...prevUser,
      profilePicture: newProfilePicture || defaultProfilePicture,
    }));
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, user, login, logout, updateProfilePicture }}
    >
      {children}
    </AuthContext.Provider>
  );
};
