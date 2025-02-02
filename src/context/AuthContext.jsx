import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useProfile } from "./ProfileContext";
import { saveToken, getToken, removeToken } from "./tokenUtils"; // ✅ Use token utils

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(getToken()); // ✅ Use getToken() for initial state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { logoutProfile } = useProfile(); // ✅ Access profile logout

  // ✅ Load user dynamically with the latest token
  const loadUser = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("❌ Failed to load user:", error.message);
      logOut();
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Login function updates token and reloads user
  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials);
        const { token, user: initialUserData } = response.data;

        saveToken(token); // ✅ Store token properly
        setAuthToken(token);
        setUser(initialUserData);
        await loadUser(); // ✅ Fetch full profile after login

        toast.success("Login successful!");
        return initialUserData;
      } catch (error) {
        console.error("❌ Login failed:", error.message);
        toast.error("Login failed. Please check your credentials.");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loadUser]
  );

  // ✅ Logout function clears token, profile, and session
  const logOut = useCallback(() => {
    removeToken(); // ✅ Properly remove token
    setAuthToken(null);
    setUser(null);
    logoutProfile(); // ✅ Clear profile data
    toast.info("Logged out successfully.");
    navigate("/login", { replace: true });
  }, [navigate, logoutProfile]);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, user, loading, login, logOut, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};
