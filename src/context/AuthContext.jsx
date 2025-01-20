import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveToken, getToken, removeToken } from "./tokenUtils";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => {
    const token = getToken();
    console.debug("Token during initialization:", token);
    return token || null;
  });
  const [user, setUser] = useState(null);

  const logIn = async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials
      );

      const { token, user } = response.data;
      console.debug("Login response:", response.data);

      if (token) {
        saveToken(token); // Save token to localStorage
        setAuthToken(token); // Update state
        setUser(user); // Update user data
      } else {
        console.error("No token received.");
      }
    } catch (error) {
      console.error("Failed to log in:", error.response?.data || error.message);
      throw error;
    }
  };

  const logOut = () => {
    console.debug("Logging out...");
    removeToken(); // Remove token from localStorage
    setAuthToken(null);
    setUser(null);
    navigate("/login");
  };

  const fetchProfile = async () => {
    if (!authToken) {
      console.error("No authToken available for profile fetch.");
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    
      // Optionally, redirect without logging out:
      // navigate("/error-page");
    }
  };
  useEffect(() => {
    const storedToken = getToken();
    console.debug("Stored token on mount:", storedToken);
    if (storedToken) {
      setAuthToken(storedToken); // Initialize authToken state
    }
  }, []);

  useEffect(() => {
    if (authToken) {
      console.debug("Fetching profile with token:", authToken);
      fetchProfile(); // Fetch profile on token change
    } else {
      console.error("No authToken found. Redirecting to login...");
      navigate("/login");
    }
  }, [authToken, navigate]);

  return (
    <AuthContext.Provider value={{ user, authToken, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export const useAuth = () => useContext(AuthContext);
