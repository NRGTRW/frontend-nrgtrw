import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "./tokenUtils"; // ✅ Import token utils

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

  // ✅ Load Profile dynamically with the latest token
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` }, // ✅ Dynamically fetch token
      });
      setProfile(response.data);
    } catch (error) {
      console.error("❌ Failed to load profile:", error.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ Save Profile changes
  const saveProfile = useCallback(async (updatedProfile) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${getToken()}` }, // ✅ Use latest token
        }
      );
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to save profile:", error.message);
      throw error;
    }
  }, []);

  // ✅ Change Profile Picture
  const changeProfilePicture = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file, file.name);

      // Upload the file
      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Save profile picture path
      const saveResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/save`,
        { profilePicture: uploadResponse.data.previewPath },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      setProfile(saveResponse.data);
      return saveResponse.data;
    } catch (error) {
      console.error("❌ Profile picture update failed:", error.message);
      throw error;
    }
  }, []);

  // ✅ Reload Profile
  const reloadProfile = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("❌ Failed to reload profile:", error.message);
      setProfile(null);
    }
  }, []);

  // ✅ Clear Profile on Logout
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
