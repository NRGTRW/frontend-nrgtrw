import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Memoized loadProfile function
  const loadProfile = useCallback(async (authToken) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to load profile:", error.message);
      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
      }
      setProfile(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized saveProfile function
  const saveProfile = useCallback(async (updatedProfile, authToken) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to save profile:", error.message);
      throw error;
    }
  }, []);

  // Memoized changeProfilePicture function
  const changeProfilePicture = useCallback(async (file, authToken) => {
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const saveResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/save`,
        { profilePicture: uploadResponse.data.previewPath },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setProfile((prev) => ({ ...prev, profilePicture: saveResponse.data.profilePicture }));
    } catch (error) {
      console.error("Failed to change profile picture:", error.message);
      throw error;
    }
  }, []);

  // Refresh the profile using refreshTrigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      const refreshData = async () => {
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            await loadProfile(token);
          } catch (error) {
            console.error("Failed to refresh profile:", error.message);
          }
        }
      };

      refreshData();
    }
  }, [refreshTrigger, loadProfile]);

  // Manual refresh trigger
  const refreshProfile = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        loadProfile,
        saveProfile,
        changeProfilePicture,
        refreshProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
