// ProfileProvider.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ProfileContext = createContext();

export const useProfile = () => {
  return useContext(ProfileContext);
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = async (authToken) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (updatedProfile, authToken) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to save profile:", error.message);
    }
  };

  const changeProfilePicture = async (file, authToken) => {
    const formData = new FormData();
    formData.append("profilePicture", file);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setProfile((prev) => ({ ...prev, profilePicture: response.data.profilePicture }));
    } catch (error) {
      console.error("Failed to upload profile picture:", error.message);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, isLoading, loadProfile, saveProfile, changeProfilePicture }}>
      {children}
    </ProfileContext.Provider>
  );
};
