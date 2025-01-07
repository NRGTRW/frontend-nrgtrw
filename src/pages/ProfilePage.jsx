import React, { useState } from "react";
import "../assets/styles/profilePage.css";

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "",
    address: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-picture">
          <img
            src="/assets/images/default-profile.png"
            alt="Profile"
            className="profile-img"
          />
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p>{profile.email}</p>
          <form>
            <input
              type="text"
              name="phone"
              placeholder="Phone (optional)"
              value={profile.phone}
              onChange={handleInputChange}
              className="profile-input"
            />
            <input
              type="text"
              name="address"
              placeholder="Address (optional)"
              value={profile.address}
              onChange={handleInputChange}
              className="profile-input"
            />
          </form>
        </div>
      </div>
      <div className="profile-display">
        {/* Add your 3D rotating objects here */}
        <div className="rotating-objects">
          {/* Placeholder: Replace with a 3D library like Three.js */}
          <p>Rotating 3D Clothes Here</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
