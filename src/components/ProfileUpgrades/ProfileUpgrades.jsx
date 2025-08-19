import React, { useState } from "react";
import "./ProfileUpgrades.css";
import { getUserAccess } from "../../utils/accessControl";
import { useProfile } from "../../context/ProfileContext";

const ProfileUpgrades = ({ isOpen, onClose, user }) => {
  const { saveProfile, reloadProfile } = useProfile();
  const access = getUserAccess(user);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Premium features in progress
  const avatars = [
    { id: "astronaut", name: "Astronaut", icon: "👨‍🚀", premium: true },
    { id: "ninja", name: "Ninja", icon: "🥷", premium: true },
    { id: "wizard", name: "Wizard", icon: "🧙‍♂️", premium: true },
    { id: "robot", name: "Robot", icon: "🤖", premium: true },
    { id: "dragon", name: "Dragon", icon: "🐉", premium: true },
    { id: "phoenix", name: "Phoenix", icon: "🦅", premium: true },
    { id: "cyber", name: "Cyber", icon: "⚡", premium: true },
    { id: "knight", name: "Knight", icon: "⚔️", premium: true },
  ];

  const themes = [
    { id: "cosmic", name: "Cosmic", preview: "✨", premium: true },
    { id: "neon", name: "Neon", preview: "💫", premium: true },
    { id: "vintage", name: "Vintage", preview: "📷", premium: true },
    { id: "minimal", name: "Minimal", preview: "⚪", premium: true },
    { id: "ocean", name: "Ocean", preview: "🌊", premium: true },
    { id: "forest", name: "Forest", preview: "🌲", premium: true },
  ];

  const handleAvatarChange = async (avatarId) => {
    // Feature in progress - show coming soon message
    alert(
      "Custom avatars coming soon! This premium feature is currently in development.",
    );
  };

  const handleThemeChange = async (themeId) => {
    // Feature in progress - show coming soon message
    alert(
      "Custom themes coming soon! This premium feature is currently in development.",
    );
  };

  const handleSave = async () => {
    // No changes to save since features are in progress
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="profile-upgrades-overlay" onClick={onClose}>
      <div
        className="profile-upgrades-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="upgrades-header">
          <h2>Profile Upgrades</h2>
          <button
            className="upgrades-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Premium Banner */}
        {!access.canAccessPremium && (
          <div className="premium-banner">
            <div className="premium-content">
              <span className="premium-icon">👑</span>
              <div className="premium-text">
                <h3>Upgrade to Premium</h3>
                <p>Unlock exclusive avatars, themes, and features</p>
              </div>
              <button
                className="upgrade-btn"
                onClick={() => alert("Premium upgrade coming soon!")}
              >
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        <div className="upgrades-content">
          {/* Avatar Selection */}
          <section className="upgrades-section">
            <h3>Choose Your Avatar</h3>
            <div className="avatar-grid">
              {avatars.map((avatar) => (
                <div
                  key={avatar.id}
                  className="avatar-option coming-soon"
                  title="Coming Soon"
                >
                  <span className="avatar-icon">{avatar.icon}</span>
                  <span className="avatar-name">{avatar.name}</span>
                  <span className="coming-soon-icon">⏳</span>
                </div>
              ))}
            </div>
          </section>

          {/* Theme Selection */}
          <section className="upgrades-section">
            <h3>Choose Your Theme</h3>
            <div className="theme-grid">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className="theme-option coming-soon"
                  title="Coming Soon"
                >
                  <span className="theme-preview">{theme.preview}</span>
                  <span className="theme-name">{theme.name}</span>
                  <span className="coming-soon-icon">⏳</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Loading Overlay */}
        {isUpdating && (
          <div className="updating-overlay">
            <div className="updating-spinner"></div>
            <p>Updating profile...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileUpgrades;
