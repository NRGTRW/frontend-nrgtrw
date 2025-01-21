// ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/profilePage.css";

const ProfilePage = () => {
  const { profile, isLoading, loadProfile, saveProfile, changeProfilePicture } = useProfile();
  const { authToken } = useAuth();

  const [formData, setFormData] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    address: profile?.address || "",
    phone: profile?.phone || "",
  });
  const [pendingSave, setPendingSave] = useState(false);

  useEffect(() => {
    if (authToken) {
      loadProfile(authToken);
    }
  }, [authToken]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingSave(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await saveProfile(formData, authToken);
    setPendingSave(false);
  };

  const handleProfilePictureUpload = (file) => {
    changeProfilePicture(file, authToken);
  };

  if (isLoading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="profile-page">No profile found. Please log in.</div>;
  }

  return (
    <div className="profile-page">
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
            src={profile?.profilePicture || "/default-profile.webp"}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
