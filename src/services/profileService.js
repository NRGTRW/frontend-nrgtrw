import axios from "axios";
import { getToken } from "../context/tokenUtils";

// Function to get the Authorization header dynamically
const getAuthHeaders = () => {
  const token = getToken(); // Make sure getToken() returns a valid token
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  };
};

export const fetchProfile = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/profile`,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to load profile:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateProfile = async (formData) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/profile`,
      formData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to update profile:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const uploadProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/profile/upload`,
      formData,
      {
        headers: getAuthHeaders(),
      },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Failed to upload profile picture:",
      error.response?.data || error.message,
    );
    throw error;
  }
}; 