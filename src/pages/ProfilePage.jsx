import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../assets/styles/profilePage.css";
import LoadingPage from "./LoadingPage";

const ProfilePage = () => {
  const { profile, isLoading, loadProfile, saveProfile, changeProfilePicture } = useProfile();
  const { authToken, logOut } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [pendingSave, setPendingSave] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("/default-profile.webp");
  const [isMounted, setIsMounted] = useState(false); // Initialize animation state

  // Load profile on initial render or when authToken changes
  useEffect(() => {
    if (authToken) {
      loadProfile(authToken);
    }
    setIsMounted(true); // Trigger animation when the component mounts
  }, [authToken]);

  // Update formData and profilePicturePreview when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
      setProfilePicturePreview(
        profile.profilePicture
          ? `http://localhost:8080${profile.profilePicture}`
          : "/default-profile.webp"
      );
    }
  }, [profile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingSave(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Save profile details
      await saveProfile(formData, authToken);

      // Save profile picture if one is selected
      if (selectedProfilePicture) {
        await changeProfilePicture(selectedProfilePicture, authToken);
      }

      // Reload the profile to update the state
      await loadProfile(authToken);

      toast.success("Profile updated successfully!");
      setPendingSave(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleProfilePictureUpload = (file) => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setProfilePicturePreview(previewURL); // Update preview
      setSelectedProfilePicture(file); // Set file for saving later
      setPendingSave(true); // Activate save button
    }
  };

  if (isLoading || !profile) {
    return <LoadingPage onFinish={() => console.log("Loading finished!")} />;
  }

  return (
    <div className={`profile-page ${isMounted ? "fade-in" : ""}`}>
      <div className="profile-container">
        <h1 className="profile-header">Your Profile</h1>
        <div
          className="profile-image-container"
          onClick={() => document.getElementById("profile-image-upload").click()}
        >
          <input
            type="file"
            accept="image/*"
            id="profile-image-upload"
            style={{ display: "none" }}
            onChange={(e) => handleProfilePictureUpload(e.target.files[0])}
          />
          <img
            src={profilePicturePreview}
            alt="Profile"
            className="profile-image"
          />
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              disabled
            />
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Optional"
            />
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="Optional"
            />
          </div>
          <div className="button-container">
            <button
              className={`save-button ${pendingSave ? "active" : ""}`}
              type="submit"
              disabled={!pendingSave}
            >
              Save Changes
            </button>
            <button
              className="logout-button"
              type="button"
              onClick={logOut}
            >
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
  