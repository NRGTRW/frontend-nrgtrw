import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { getToken } from "./tokenUtils";

export const ProfileContext = createContext(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  
  // Always return a working context object
  if (context === null || context === undefined) {
    console.warn("⚠️ ProfileContext is null/undefined, using fallback");
    return {
      profile: null,
      setProfile: () => {},
      isLoading: false,
      loadProfile: async () => {
        console.log("Fallback loadProfile called - no real functionality");
        return Promise.resolve();
      },
      saveProfile: async () => {
        console.log("Fallback saveProfile called - no real functionality");
        return Promise.resolve();
      },
      changeProfilePicture: async () => {
        console.log("Fallback changeProfilePicture called - no real functionality");
        return Promise.resolve();
      },
      reloadProfile: async () => {
        console.log("Fallback reloadProfile called - no real functionality");
        return Promise.resolve();
      },
      logoutProfile: () => {
        console.log("Fallback logoutProfile called - no real functionality");
      },
    };
  }
  
  return context;
};

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.warn("No auth token available for profile loading");
        setProfile(null);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setProfile(response.data);
    } catch (error) {
      console.error("❌ Failed to load profile:", error.message);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (updatedProfile) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      setProfile(response.data.user || response.data); // handle both {user: ...} and direct
      return response.data.user || response.data;
    } catch (error) {
      console.error("❌ Failed to save profile:", error.message);
      throw error;
    }
  }, []);

  const changeProfilePicture = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append("profilePicture", file, file.name);

      const uploadResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/profile/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const saveResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/save`,
        { profilePicture: uploadResponse.data.previewPath },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );

      setProfile(saveResponse.data);
      return saveResponse.data;
    } catch (error) {
      console.error("❌ Profile picture update failed:", error.message);
      throw error;
    }
  }, []);

  const reloadProfile = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/profile`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      setProfile(response.data);
    } catch (error) {
      console.error("❌ Failed to reload profile:", error.message);
      setProfile(null);
    }
  }, []);

  const logoutProfile = useCallback(() => {
    setProfile(null);
  }, []);

  const contextValue = {
    profile,
    setProfile,
    isLoading,
    loadProfile,
    saveProfile,
    changeProfilePicture,
    reloadProfile,
    logoutProfile,
  };
  
  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};
