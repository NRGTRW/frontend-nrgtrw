import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/profilePage.css";

const ProfilePage = () => {
  const { user, updateProfilePicture, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(user.profilePicture);
  const [formData, setFormData] = useState({
    name: user.name || "John Doe",
    email: user.email || "john.doe@example.com",
    address: "",
    phone: "",
  });

  const [unsavedData, setUnsavedData] = useState({
    name: formData.name,
    email: formData.email,
    address: formData.address,
    phone: formData.phone,
    profileImage: profileImage,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setUnsavedData((prev) => ({ ...prev, profileImage: newImageUrl }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnsavedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setProfileImage(unsavedData.profileImage);
    setFormData({
      name: unsavedData.name,
      email: unsavedData.email,
      address: unsavedData.address,
      phone: unsavedData.phone,
    });
    updateProfilePicture(unsavedData.profileImage);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <>
      <div className="profile-page-container">
        {/* Left Section: Profile Information */}
        <div className="profile-info">
          <div className="profile-header">
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: "none" }}
              id="profile-image-upload"
            />
            <img
              src={unsavedData.profileImage}
              alt="Profile"
              className="profile-image"
              onClick={() => document.getElementById("profile-image-upload").click()}
            />
            <h1>{unsavedData.name}</h1>
          </div>
          <div className="profile-details">
            <div className="profile-field">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={unsavedData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
            <div className="profile-field">
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={unsavedData.address}
                onChange={handleInputChange}
                placeholder="Optional"
                className={unsavedData.address ? "active-field" : "inactive-field"}
              />
            </div>
            <div className="profile-field">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={unsavedData.phone}
                onChange={handleInputChange}
                placeholder="Optional"
                className={unsavedData.phone ? "active-field" : "inactive-field"}
              />
            </div>
          </div>
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
          {showPopup && <div className="popup-message">Profile Updated Successfully!</div>}
        </div>

        {/* Right Section: Wishlist */}
        <div className="wishlist-3d">
          <h2>Your Wishlist</h2>
          {/* Add wishlist display logic here */}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
