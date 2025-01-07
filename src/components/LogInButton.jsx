import React, { useState } from "react";
import "../assets/styles/logInButton.css";
import defaultProfileImage from "../assets/images/default-avatar.webp"; // Default image

const LogInButton = ({ user, onLogin, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="login-button-container">
      {user ? (
        <>
          <div className="profile-icon" onClick={toggleDropdown}>
            <img src={user.profileImage || defaultProfileImage} alt="Profile" />
          </div>
          {dropdownOpen && (
            <div className="profile-dropdown active">
              <div className="profile-dropdown-item" onClick={() => console.log("Go to profile")}>
                Profile
              </div>
              <div className="profile-dropdown-item" onClick={() => console.log("Settings")}>
                Settings
              </div>
              <div className="profile-dropdown-item" onClick={onLogout}>
                Log Out
              </div>
            </div>
          )}
        </>
      ) : (
        <button className="login-button" onClick={onLogin}>
          Log In
        </button>
      )}
    </div>
  );
};

export default LogInButton;
