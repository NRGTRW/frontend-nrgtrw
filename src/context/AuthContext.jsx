import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveToken, getToken, removeToken } from "./tokenUtils";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => getToken() || null);
  const [user, setUser] = useState(null);

  const logIn = async (credentials) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        credentials
      );

      const { token, user } = response.data;

      if (token) {
        saveToken(token);
        setAuthToken(token);
        setUser(user);
        toast.success("Logged in successfully!");
        // Refresh the page after login to ensure user data is loaded
        setTimeout(() => window.location.reload(), 500);
      } else {
        throw new Error("No token received.");
      }
    } catch (error) {
      console.error("Failed to log in:", error.response?.data || error.message);
      toast.error(error.response?.data.message || "Failed to log in. Please try again.");
    }
  };

  const logOut = () => {
    removeToken();
    setAuthToken(null);
    setUser(null);
    navigate("/login");
    toast.info("Logged out successfully.");
  };

  const fetchProfile = async () => {
    if (!authToken) {
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setAuthToken(storedToken);
      fetchProfile();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, authToken, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };
export const useAuth = () => useContext(AuthContext);
