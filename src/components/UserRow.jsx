import React, { useState } from "react";

const UserRow = ({ user, profilePicture, defaultProfilePicture, handleClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ position: "relative", display: "inline-block", cursor: "pointer" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick} // Allow clicking to navigate to profile
    >
      {/* Profile Image */}
      <img
        src={profilePicture}
        alt="Profile"
        className="profile-icon"
        onError={(e) => (e.target.src = defaultProfilePicture)}
        tabIndex={0}
        aria-label="Navigate to profile"
      />

      {/* Hover Tooltip */}
      {hovered && user?.name && (
        <div
          style={{
            position: "absolute",
            background: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            top: "40px",
            left: "50%",
            transform: "translateX(-80%)",
            fontSize: "14px",
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {user.name}
        </div>
      )}
    </div>
  );
};

export default UserRow;
