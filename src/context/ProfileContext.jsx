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

  // Load profile data from the backend
  const loadProfile = useCallback(async (authToken) => {
    setIsLoading(true);
    try {
      console.log("Loading profile data from backend...");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      console.log("Profile data loaded:", response.data);
      setProfile(response.data);
    } catch (error) {
      console.error("Failed to load profile:", {
        errorMessage: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
      });
      setProfile(null);
      throw error; // Propagate the error to the caller
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save updated profile data to the backend
  const saveProfile = useCallback(async (updatedProfile, authToken) => {
    try {
      console.log("Saving updated profile data...");
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile`,
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      console.log("Profile data saved successfully:", response.data);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to save profile:", {
        errorMessage: error.message,
        responseData: error.response?.data,
        responseStatus: error.response?.status,
      });
      throw error;
    }
  }, []);

  // Upload and save function
const changeProfilePicture = useCallback(async (file, authToken) => {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file, file.name);
    
    // Validate file before upload
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    const uploadResponse = await axios.post(
      `${import.meta.env.VITE_API_URL}/profile/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
        timeout: 15000
      }
    );

    if (uploadResponse.status !== 200) {
      throw new Error(uploadResponse.data.error || 'Upload failed');
    }

    // Verify response structure
    if (!uploadResponse.data?.previewPath) {
      throw new Error('Invalid server response format');
    }

    return await saveProfilePicture(uploadResponse.data.previewPath, authToken);
  } catch (error) {
    console.error('Full Error Chain:', {
      axiosError: error.message,
      serverResponse: error.response?.data,
      stack: error.stack
    });
    throw error;
  }
}, []);
  
  // Separate save function
  const saveProfilePicture = async (url, authToken) => {
    try {
      console.log('Saving profile picture URL:', url);
      
      // Validate URL format before sending
      if (!url.startsWith('http')) {
        throw new Error('Invalid image URL format received');
      }
  
      const saveResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/profile/save`,
        { profilePicture: url },
        { 
          headers: { 
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
  
      console.log('Save response:', saveResponse.data);
      return saveResponse.data;
    } catch (error) {
      console.error('Save Picture Error:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to save profile picture'
      );
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        isLoading,
        loadProfile,
        saveProfile,
        changeProfilePicture,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};