import { useState, useEffect } from "react";
import { fetchProfileData, saveProfileData, uploadProfilePictureData } from "../services/profileService";

const useProfileLogic = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [emailError, setEmailError] = useState("");
  const [pendingSave, setPendingSave] = useState(false);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfileData();
        setFormData(profileData);
        setProfileImage(profileData.profilePicture || null);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (file) => {
    try {
      const updatedProfile = await uploadProfilePictureData(file);
      setProfileImage(updatedProfile.profilePicture);
      setPendingSave(true);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  // Handle field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingSave(true);
  };

  // Validate email
  const validateEmail = async () => {
    try {
      const response = await fetch("/api/validate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      const result = await response.json();
      if (!result.isValid) {
        setEmailError("Invalid email address");
      } else {
        setEmailError("");
      }
    } catch (error) {
      console.error("Error validating email:", error);
      setEmailError("Validation failed");
    }
  };

  // Handle save changes
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent page refresh
    if (emailError) {
      alert("Please fix email errors before saving.");
      return;
    }
    try {
      const updatedProfile = await saveProfileData({
        ...formData,
        profilePicture: profileImage,
      });
      setFormData(updatedProfile);
      setProfileImage(updatedProfile.profilePicture || null);
      setPendingSave(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return {
    profileImage,
    formData,
    emailError,
    pendingSave,
    handleProfilePictureUpload,
    handleFormChange,
    handleSave,
    validateEmail,
  };
};

export default useProfileLogic;
