import React from "react";
import useProfileLogic from "./ProfilePageLogic";
import "../assets/styles/profilePage.css";

const ProfilePage = () => {
  const {
    profileImage,
    formData,
    emailError,
    pendingSave,
    isLoading,
    handleProfilePictureUpload,
    handleFormChange,
    handleSave,
    validateEmail,
  } = useProfileLogic();

  if (isLoading) {
    return <div className="profile-page">Loading profile...</div>;
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
            src={profileImage || "/default-profile.webp"}
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
              onBlur={validateEmail} // Validate email on blur
            />
            {emailError && <p className="error-message">{emailError}</p>}
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
