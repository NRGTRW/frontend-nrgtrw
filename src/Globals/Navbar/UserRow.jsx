import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserRow = ({ user, profilePicture, defaultProfilePicture }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Utility: Determine if the device supports touch.
  const isTouchDevice = () =>
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Handle clicks/taps on the component.
  // • On desktop, clicking navigates immediately.
  // • On touch devices, if the tooltip is not visible, show it.
  //   If it’s already visible, navigate to /profile.
  const handleClick = (e) => {
    if (isTouchDevice()) {
      if (tooltipVisible) {
        // Second tap: navigate and hide tooltip.
        setTooltipVisible(false);
        navigate("/profile");
      } else {
        // First tap: show tooltip (do not navigate yet).
        setTooltipVisible(true);
      }
    } else {
      navigate("/profile");
    }
  };

  // Desktop: Show tooltip on mouse enter.
  const handleMouseEnter = () => {
    if (!isTouchDevice()) {
      setTooltipVisible(true);
    }
  };

  // Desktop: Hide tooltip on mouse leave.
  const handleMouseLeave = () => {
    if (!isTouchDevice()) {
      setTooltipVisible(false);
    }
  };

  // Mobile: Also show tooltip on touch start (if not already visible).
  const handleTouchStart = () => {
    if (isTouchDevice() && !tooltipVisible) {
      setTooltipVisible(true);
    }
  };

  // Global click (and touch) listener: If the tooltip is visible and the user
  // clicks/taps outside the component, hide the tooltip.
  useEffect(() => {
    const handleOutsideInteraction = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setTooltipVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideInteraction);
    document.addEventListener("touchstart", handleOutsideInteraction);
    return () => {
      document.removeEventListener("click", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      {/* Profile Image */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src={profilePicture}
          alt="User profile"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
          onError={(e) => (e.target.src = defaultProfilePicture)}
        />
      </div>
      {/* Tooltip displaying the user's name */}
      {tooltipVisible && user?.name && (
        <div
          style={{
            position: "absolute",
            background: "#333",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "5px",
            top: "100%",
            left: "50%",
            transform: "translate(-80%, 10px)",
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        >
          {user.name}
        </div>
      )}
    </div>
  );
};

export default UserRow;
