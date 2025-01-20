import axios from "axios";

const API_URL = "/api/profile";

// Fetch profile data
const token = localStorage.getItem("token");

const fetchProfile = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile.");
    }

    const profile = await response.json();
    console.log("Profile:", profile);
  } catch (error) {
    console.error(error.message);
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
