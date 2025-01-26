import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/profilePage.css";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { profile, loadProfile, saveProfile, changeProfilePicture } = useProfile();
  const { authToken, logOut, loadUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [pendingSave, setPendingSave] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("/default-profile.webp");
  const [isLoading, setIsLoading] = useState(true);
  const [showGameButton, setShowGameButton] = useState(location.state?.fromLogin || false);

  useEffect(() => {
    const initializeProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        toast.error("You are not authenticated. Redirecting to login...");
        navigate("/login", { replace: true });
        return;
      }

      try {
        if (location.state?.fromLogin) {
          await Promise.all([loadUser(), loadProfile(token)]);
          navigate(location.pathname, { replace: true, state: {} });
        } else {
          await loadProfile(token);
        }
      } catch (error) {
        console.error("Failed to load profile:", error.message);
        toast.error("Failed to load profile. Redirecting to login...");
        navigate("/login", { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    initializeProfile();
  }, [navigate, location.state, location.pathname, loadUser, loadProfile]);

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
          ? `${import.meta.env.VITE_PROFILE_PIC_URL}${profile.profilePicture}`
          : "/default-profile.webp"
      );
    }
  }, [profile]);

  useEffect(() => {
    return () => {
      if (selectedProfilePicture) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [selectedProfilePicture, profilePicturePreview]);
  
  const handleProfilePictureUpload = (file) => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setProfilePicturePreview(previewURL);
      setSelectedProfilePicture(file);
      setPendingSave(true);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setPendingSave(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await saveProfile(formData, authToken);

      if (selectedProfilePicture) {
        await changeProfilePicture(selectedProfilePicture, authToken);
      }

      await Promise.all([loadUser(), loadProfile(authToken)]);
      toast.success("Profile updated successfully!");
      setPendingSave(false);
    } catch (error) {
      console.error("Error saving profile:", error.message);
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const handleGameButtonClick = () => {
    setShowGameButton(false); // Hide button after click
    window.location.reload(); // Refresh the page immediately
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-header">Your Profile</h1>
        {showGameButton && (
          <div className="game-button-overlay">
            <button className="game-refresh-button" onClick={handleGameButtonClick}>
              <div className="circular-arrow"></div>
              <span className="button-text">Press Me</span>
            </button>
          </div>
        )}
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
          <img src={profilePicturePreview} alt="Profile" className="profile-image" />
        </div>
        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-field">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} readOnly />
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
            <button className="logout-button" type="button" onClick={logOut}>
              Log Out
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
