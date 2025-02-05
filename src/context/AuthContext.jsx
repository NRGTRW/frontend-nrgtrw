// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "./ProfileContext"; // if you have a ProfileContext

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize authToken from localStorage
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logoutProfile } = useProfile();

  // Function to load the user profile
  const loadUser = useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const userData = response.data;
  
      // Ensure the role is available, if not, set a default
      userData.role = userData.role?.trim() || "USER";
        
      setUser(userData);
    } catch (error) {
      console.error("Failed to load user:", error.message);
      logOut(); // Logout if token is invalid
    } finally {
      setLoading(false);
    }
  }, [authToken]);
  

  // Login function using the correct endpoint /auth/login
  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/login`,
          credentials
        );
        const { token, user: initialUserData } = response.data;
        // Save token and update state
        localStorage.setItem("authToken", token);
        setAuthToken(token);
        setUser(initialUserData);
        // Reload the user profile
        await loadUser();
        toast.success("🎉 Welcome back! You’re now logged in.");
        return initialUserData;
      } catch (error) {
        toast.error("🚫 Login unsuccessful! Please double-check your email and password.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadUser]
  );

  // Logout function to clear auth state
  const logOut = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    logoutProfile();
    toast.info("👋 You have been logged out. See you again soon!");
    navigate("/login", { replace: true });
  }, [navigate, logoutProfile]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ authToken, user, loading, login, logOut, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
