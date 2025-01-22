import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveToken, getToken, removeToken } from "./tokenUtils";
import { toast } from "react-toastify";
import { useProfile } from "../context/ProfileContext"; // Import useProfile to manage profiles

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState(() => getToken() || null);
  const [user, setUser] = useState(null);

  // Use profile context functions
  const { setProfile, loadProfile } = useProfile();

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
  
        // Dynamically load profile after login
        await loadProfile(token);
  
        toast.success("Logged in successfully!");
        navigate("/profile"); // Navigate to the profile page
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
    setProfile(null); // Clear the profile on logout
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
      setProfile(response.data); // Update the profile with fetched data
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      throw error;
    }
  };

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken) {
      setAuthToken(storedToken);
      fetchProfile(); // Fetch profile on initial load if token exists
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
