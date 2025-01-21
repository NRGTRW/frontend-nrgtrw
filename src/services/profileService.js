import axios from "axios";

export const fetchProfile = async (authToken) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to load profile:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProfile = async (authToken, formData) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_API_URL}/profile`, formData, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update profile:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadProfilePicture = async (authToken, file) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/profile/upload`, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to upload profile picture:", error.response?.data || error.message);
    throw error;
  }
};
