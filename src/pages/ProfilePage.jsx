import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/profilePage.css";
import defaultProfilePicture from "../assets/images/default-profile.webp";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfilePicture, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(
    user?.profilePicture || defaultProfilePicture
  );
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    address: "",
    phone: "",
  });
  const [pendingSave, setPendingSave] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setProfileImage(newImageUrl);
      setPendingSave(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setPendingSave(true);
  };

  const handleSave = () => {
    updateProfilePicture(profileImage);
    console.log("Saved Profile Data:", { ...formData, profileImage });
    setPendingSave(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-header">Your Profile</h1>
        <div className="profile-image-container">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: "none" }}
            id="profile-image-upload"
          />
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
            onClick={() => document.getElementById("profile-image-upload").click()}
          />
        </div>
        <div className="profile-fields">
          <div className="profile-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled
            />
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Optional"
            />
          </div>
        </div>
        <button
          className={`edit-profile-button ${pendingSave ? "active" : ""}`}
          onClick={handleSave}
          disabled={!pendingSave}
        >
          Save Changes
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
