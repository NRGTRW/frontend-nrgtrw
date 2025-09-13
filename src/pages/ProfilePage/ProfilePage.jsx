import React, { useState, useEffect } from "react";
import { useProfile } from "../../context/ProfileContext";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./profilePage.css";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoaderModal from "../../components/Modals/LoaderModal";
import LoadingPage from "../LoadingPage/LoadingPage";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import ProfileUpgrades from "../../components/ProfileUpgrades/ProfileUpgrades";

const ProfilePage = () => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const profileContext = useProfile();
  const {
    profile,
    loadProfile,
    saveProfile,
    changeProfilePicture,
    reloadProfile,
  } = profileContext || {};
  const authContext = useAuth();
  const authToken = authContext?.authToken;
  const logOut = authContext?.logOut;
  const loadUser = authContext?.loadUser;
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
  const [profilePicturePreview, setProfilePicturePreview] = useState(
    "/default-profile.webp",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);

  useEffect(() => {
    // Check for token in query string (OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const tokenFromQuery = params.get("token");
    if (tokenFromQuery) {
      localStorage.setItem("authToken", tokenFromQuery);
      // Remove token from URL
      params.delete("token");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
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
              window.location.reload();
            } else {
              await loadProfile(token);
            }
          } catch (error) {
            console.error("Error in initializeProfile:", error);
            toast.error(t("profile.errorLoading"));
            navigate("/login", { replace: true });
          } finally {
            setIsLoading(false);
            setShowLoader(false);
          }
        };
    initializeProfile();
  }, [navigate, location.state, loadUser, loadProfile, t]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        address: profile.address || "",
        phone: profile.phone || "",
      });
      setProfilePicturePreview(
        profile.profilePicture || "/default-profile.webp",
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
    setIsSaving(true);
    setShowLoader(true);

    try {
      await saveProfile(formData, authToken);
      if (selectedProfilePicture) {
        await changeProfilePicture(selectedProfilePicture, authToken);
      }
      await reloadProfile(authToken);
      toast.success(t("profile.changesSaved"));
      setPendingSave(false);
    } catch (error) {
      toast.error(t("profile.errorSaving"));
    } finally {
      setIsSaving(false);
      setShowLoader(false);
    }

    navigate("/");
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      {showLoader && (
        <LoaderModal
          message={
            isSaving ? t("profile.savingChanges") : t("profile.loadingProfile")
          }
        />
      )}
      <div className="profile-page">
        <GoBackButton />
        <div className="profile-container">
          <h1 className="profile-header">{t("profile.yourProfile")}</h1>

          <div
            className="profile-image-container"
            style={{
              position: "relative",
              width: "150px",
              height: "150px",
              margin: "0 auto 20px auto",
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
            >
              <img
                src={profilePicturePreview}
                alt={t("profile.profilePictureAlt")}
                className="profile-image"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.target.src = "/default-profile.webp")}
              />
            </label>
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
              }}
            >
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0L15.13 4.87l3.75 3.75 1.83-1.83z" />
              </svg>
            </div>
          </div>

          <form className="profile-form" onSubmit={handleSave}>
            <div className="profile-field">
              <label htmlFor="name">{t("profile.name")}:</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="email">{t("profile.email")}:</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                readOnly
              />
            </div>
            <div className="profile-field">
              <label htmlFor="address">{t("profile.address")}:</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder={t("profile.optional")}
              />
            </div>
            <div className="profile-field">
              <label htmlFor="phone">{t("profile.phone")}:</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleFormChange}
                placeholder={t("profile.optional")}
              />
            </div>

            <div className="button-container">
              <button
                className={`save-button ${pendingSave ? "active" : ""}`}
                type="submit"
                disabled={!pendingSave}
              >
                {isSaving ? t("profile.saving") : t("profile.saveChanges")}
              </button>
              <button
                className="upgrades-button"
                type="button"
                onClick={() => setShowUpgrades(true)}
              >
                🎨 Profile Upgrades
              </button>
              <button className="logout-button" type="button" onClick={logOut}>
                {t("profile.logOut")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profile Upgrades Modal */}
      <ProfileUpgrades
        isOpen={showUpgrades}
        onClose={() => setShowUpgrades(false)}
        user={profile}
      />
    </>
  );
};

export default ProfilePage;
