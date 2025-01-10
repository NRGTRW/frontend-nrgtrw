import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/profilePage.css";

const ProfilePage = () => {
  const { user, updateProfilePicture, logout } = useAuth();
  const [profileImage, setProfileImage] = useState(user?.profilePicture || "/default-profile.png");
  const [formData, setFormData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    address: user?.address || "",
    phone: user?.phone || "",
  });
  const [unsavedData, setUnsavedData] = useState({ ...formData });
  const [isEditing, setIsEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(response.statusText); // Handle non-200 responses
        }
    
        const data = await response.json();
        setFormData(data);
        setUnsavedData(data);
        setProfileImage(data.profilePicture || "/default-profile.png");
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };
    
    

    fetchProfile();
  }, []);

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);
  
      try {
        const response = await fetch("/api/profile/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }
  
        const data = await response.json();
        setProfileImage(data.profile.profilePicture);
        updateProfilePicture(data.profile.profilePicture);
      } catch (error) {
        console.error("Error uploading profile picture:", error.message);
      }
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUnsavedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(unsavedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save profile");
      }
  
      const data = await response.json();
      setFormData({ ...unsavedData });
      setIsEditing(false);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (error) {
      console.error("Error saving profile:", error.message);
    }
  };

  const handleCancelEdit = () => {
    setUnsavedData({ ...formData });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="profile-page-container">
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
            src={profileImage.startsWith("http") ? profileImage : `http://localhost:5173${profileImage}`}
            alt="Profile"
            className="profile-image"
            onClick={() => document.getElementById("profile-image-upload").click()}
          />
          <h1>{formData.name}</h1>
        </div>
        <div className="profile-details">
          <div className="profile-field">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} disabled />
          </div>
          <div className="profile-field">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={unsavedData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </div>
          <div className="profile-field">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={unsavedData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Optional"
            />
          </div>
          <div className="profile-field">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={unsavedData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Optional"
            />
          </div>
        </div>
        {isEditing ? (
          <div className="edit-buttons">
            <button className="profile-save-button" onClick={handleSave}>
              Save Changes
            </button>
            <button className="profile-cancel-button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="profile-edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
        <button className="profile-logout-button" onClick={handleLogout}>
          Logout
        </button>
        {showPopup && <div className="popup-message">Profile Updated Successfully!</div>}
      </div>

      <div className="wishlist-3d">
        <h2>Your Wishlist</h2>
        <div className="wishlist-display">
          <div className="wishlist-item">
            <img src="/images/sample-item1.webp" alt="Wishlist Item 1" className="wishlist-image" />
            <p>Wishlist Item 1</p>
          </div>
          <div className="wishlist-item">
            <img src="/images/sample-item2.webp" alt="Wishlist Item 2" className="wishlist-image" />
            <p>Wishlist Item 2</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
