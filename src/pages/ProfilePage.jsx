import React, { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "../assets/styles/profilePage.css";
import { toast } from "react-toastify";
import LoaderModal from "../components/LoaderModal";
import LoadingPage from "./LoadingPage";

const ProfilePage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const { profile, loadProfile, saveProfile, changeProfilePicture, reloadProfile } = useProfile();
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
  const [showLoader, setShowLoader] = useState(false);
  const [showGameButton, setShowGameButton] = useState(location.state?.fromLogin || false);

  // Utility: refresh the page.
  const refreshPage = () => {
    window.location.reload();
  };

  // Load profile on page load or after login.
  useEffect(() => {
    const initializeProfile = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setShowLoader(true);
        if (location.state?.fromLogin) {
          await Promise.all([loadUser(), loadProfile(token)]);
          refreshPage(); // Refresh after login.
        } else {
          await loadProfile(token);
        }
      } catch (error) {
        console.error("Failed to load profile:", error.message);

        // Handle 401 errors.
        if (error.response?.status === 401) {
          toast.error("🔄 Session timeout! Refreshing for security.");
          setTimeout(refreshPage, 2000);
        } else {
          toast.error("Failed to load profile. Redirecting to login...");
          navigate("/login", { replace: true });
        }
      } finally {
        toast.info("🛠️ Edit mode activated! You can now update your details.");
        setIsLoading(false);
        setShowLoader(false);
      }
    };

    initializeProfile();
  }, [navigate, location.state, location.pathname, loadUser, loadProfile]);

  // Set form data and profile picture preview when profile is loaded.
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
      setProfilePicturePreview(profile.profilePicture || "/default-profile.webp");
    }
  }, [profile]);

  // Revoke the object URL when component unmounts or the image changes.
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
    setShowLoader(true);

    try {
      await saveProfile(formData, authToken);

      if (selectedProfilePicture) {
        await changeProfilePicture(selectedProfilePicture, authToken);
      }

      await reloadProfile(authToken); // Refresh profile data.
      toast.success("Changes saved! Your profile has been updated.");
      setPendingSave(false);
    } catch (error) {
      console.error("Save error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Refreshing...");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(error.message || "Failed to save profile");
      }
    } finally {
      setIsSaving(false);
      setShowLoader(false);
      navigate("/");
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      {showLoader && <LoaderModal message={isSaving ? "Saving changes..." : "Loading profile..."} />}
      <div className="profile-page">
        <div className="profile-container">
          <h1 className="profile-header">Your Profile</h1>
          {/* Profile Picture Section */}
          <div
            className="profile-image-container"
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              margin: "0 auto 20px auto", // Center the container and add bottom margin
            }}
          >
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
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            >
              <img
                src={profilePicturePreview}
                alt="User profile"
                className="profile-image"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover", // Ensure the image covers the container without deformation
                }}
                onError={(e) => {
                  e.target.src = "/default-profile.webp";
                }}
              />
            </label>
            {/* Edit Icon Overlay (positioned on top of the profile image) */}
            <div
              className="edit-icon"
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                backgroundColor: "rgba(0,0,0,0.6)",
                borderRadius: "50%",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none", // Ensures the icon doesn't interfere with clicking the label
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0L15.13 4.87l3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
          </div>

          {/* Profile Form */}
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
    </>
  );
};

export default ProfilePage;
