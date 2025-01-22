import React, { createContext, useContext, useState } from "react";
import axios from "axios";

// Create the ProfileContext
export const ProfileContext = createContext();

// Custom Hook to Use the ProfileContext
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

// ProfileProvider Component
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Manage loading state

  // Load Profile Function
  const loadProfile = async (authToken) => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProfile(response.data); // Update profile state with response data
    } catch (error) {
      console.error("Failed to load profile:", error.message);
      setProfile(null); // Reset profile on error
    } finally {
      setIsLoading(false); // End loading
    }
  };

  // Save Profile Function
  const saveProfile = async (updatedProfile, authToken) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      setProfile(response.data); // Update profile with new data
    } catch (error) {
      console.error("Failed to save profile:", error.message);
    }
  };

  // Change Profile Picture Function
  const changeProfilePicture = async (file, authToken) => {
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

      const previewPath = uploadResponse.data.previewPath;

      // Save profile picture path to the database
      const saveResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/save`,
        { profilePicture: previewPath },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      setProfile((prev) => ({
        ...prev,
        profilePicture: saveResponse.data.profilePicture,
      }));
    } catch (error) {
      console.error("Failed to change profile picture:", error.message);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        loadProfile,
        saveProfile,
        setProfile,
        changeProfilePicture,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
  