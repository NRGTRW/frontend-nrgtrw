// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "./ProfileContext"; // <-- Import ProfileContext

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Access the logoutProfile function to clear the profile on logout
  const { logoutProfile } = useProfile();

  // Load the user (minimal data) from /profile if authToken exists
  const loadUser = useCallback(async () => {
    if (!authToken) return;

    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to load user:", error.message);
      logOut(); // If token fails, log out
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Login sets auth token, user, and then does a full user load
  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials);
        const { token, user: initialUserData } = response.data;

        // Store token
        localStorage.setItem("authToken", token);
        setAuthToken(token);

        // Set user data right away
        setUser(initialUserData);

        // Then re-load the user (to confirm profile, etc.)
        await loadUser();

        toast.success("Login successful!");
        return initialUserData;
      } catch (error) {
        toast.error("Login failed. Please check your credentials.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadUser]
  );

  // Log out: clear auth and profile
  const logOut = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    logoutProfile(); // Clear the profile in ProfileContext
    toast.info("Logged out successfully.");
    navigate("/login", { replace: true });
  }, [navigate, logoutProfile]);

  // On mount or if authToken changes, load the user
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        user,
        loading,
        login,
        logOut,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
