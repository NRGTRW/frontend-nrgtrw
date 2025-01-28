// ProfileContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
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

  // Load the profile
  const loadProfile = useCallback(async (authToken) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error.message);
      setProfile(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save the profile
  const saveProfile = useCallback(async (updatedProfile, authToken) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to save profile:", error.message);
      throw error;
    }
  }, []);

  // Change the profile picture
  const changeProfilePicture = useCallback(async (file, authToken) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file, file.name);

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
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setProfile(saveResponse.data);
      return saveResponse.data;
    } catch (error) {
      console.error("Profile picture update failed:", error);
      throw error;
    }
  }, []);

  // Reload the profile
  const reloadProfile = useCallback(async (authToken) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to reload profile:", error.message);
      setProfile(null);
    }
  }, []);

  // Clear the profile (called on logout)
  const logoutProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        isLoading,
        loadProfile,
        saveProfile,
        changeProfilePicture,
        reloadProfile,
        logoutProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
