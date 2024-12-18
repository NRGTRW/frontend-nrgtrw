import React, { createContext, useState, useEffect } from "react";
import { login, logout } from "../services/authService";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      // Fetch user profile or validate token here if needed
      setUser({ email: "test@example.com" });
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    const data = await login(email, password);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const handleLogout = () => {
    logout();
    setToken(null);
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AppContext.Provider>
  );
};
