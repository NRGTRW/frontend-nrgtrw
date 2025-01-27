import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/profilePage.css";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const [isSaving, setIsSaving] = useState(false);
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
        toast.error("You are not authenticated. Please login...");
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
        profile.profilePicture || "/default-profile.webp"
      );
      // setProfilePicturePreview(
      //   profile.profilePicture
      //     ? `${import.meta.env.VITE_IMAGE_BASE_URL}/${profile.profilePicture}`
      //     : "/default-profile.webp"
      // );
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
    setIsSaving(true);
  
    try {
      // Save profile form data first
      await saveProfile(formData, authToken);
  
      // Then handle profile picture if selected
      if (selectedProfilePicture) {
        const updatedProfile = await changeProfilePicture(selectedProfilePicture, authToken);
        
        // Update preview with direct URL from response
        setProfilePicturePreview(updatedProfile.profilePicture);
      }
  
      await loadProfile(authToken);
      toast.success("Profile updated successfully!");
      setPendingSave(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGameButtonClick = () => {
    setShowGameButton(false);
    window.location.reload();
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1 className="profile-header">Your Profile</h1>

        {showGameButton && (
          <div className="game-button-overlay" role="dialog" aria-label="Game control">
            <button
              className="game-refresh-button"
              onClick={handleGameButtonClick}
              aria-label="Refresh game"
            >
              <div className="circular-arrow" aria-hidden="true"></div>
              <span className="button-text">Press Me</span>
            </button>
          </div>
        )}

        <div className="profile-image-container">
          <input
            type="file"
            accept="image/*"
            id="profile-image-upload"
            className="visually-hidden"
            onChange={(e) => handleProfilePictureUpload(e.target.files?.[0])}
          />
          <label
            htmlFor="profile-image-upload"
            className="profile-image-label"
            role="button"
            tabIndex={0}
          >
            <img
              src={profilePicturePreview}
              alt="User profile"
              className="profile-image"
              onError={(e) => {
                e.target.src = "/default-profile.webp";
              }}
            />
          </label>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <div className="profile-field">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
          </div>

          <div className="profile-field">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              readOnly
              aria-readonly="true"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              placeholder="Optional"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="phone">Phone:</label>
            <input
              id="phone"
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
              aria-busy={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="logout-button"
              type="button"
              onClick={logOut}
              aria-label="Log out of account"
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
  