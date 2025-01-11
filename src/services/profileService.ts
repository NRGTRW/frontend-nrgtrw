import axios from "axios";

const API_URL = "/api/profile";

// Fetch profile data
export const fetchProfileData = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  }
};

// Save profile data
export const saveProfileData = async (formData) => {
  try {
    const response = await axios.put(API_URL, formData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saving profile data:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePictureData = async (file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};
