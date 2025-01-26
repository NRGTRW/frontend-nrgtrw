// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      logOut();
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, credentials);
      const { token, user: initialUserData } = response.data;
      
      localStorage.setItem('authToken', token);
      setAuthToken(token);
      
      // Set initial user data immediately
      setUser(initialUserData);
      
      // Then perform full profile load
      await loadUser();
      
      toast.success('Login successful!');
      return initialUserData;
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  const logOut = useCallback(() => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
    toast.info("Logged out successfully.");
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ 
      authToken, 
      user, 
      loading,
      login, 
      logOut,
      loadUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};