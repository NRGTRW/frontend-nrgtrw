import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "../assets/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState(defaultProfilePicture);
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { user } = useAuth();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleAuthenticatedNavigation = (authenticatedPath, unauthenticatedPath) => {
    if (user) {
      navigate(authenticatedPath);
    } else {
      navigate(unauthenticatedPath);
    }
  };

  const handleProfileNavigation = () => handleAuthenticatedNavigation("/profile", "/login");

  // Update the profile picture dynamically
  useEffect(() => {
    const newProfilePicture = user?.profilePicture
      ? `${import.meta.env.VITE_PROFILE_PIC_URL}${user.profilePicture}`
      : defaultProfilePicture;
  
    setProfilePicture(newProfilePicture);
  }, [user]);  

  return (
    <header className="navbar">
      <div className="top-bar">
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <li
          className="logo"
          onClick={() => handleNavigation("/")}
          onKeyPress={(e) => e.key === "Enter" && handleNavigation("/")}
          tabIndex={0}
          aria-label="Navigate to home"
        >
          NRG
        </li>
        <div className="right-container">
          <div className="wishlist-container">
            <img
              src={heartOutline}
              alt="Wishlist"
              className="wishlist-icon"
              onClick={() => handleAuthenticatedNavigation("/wishlist", "/login")}
              tabIndex={0}
              aria-label="Navigate to wishlist"
            />
          </div>
          <div className="cart-container">
            <img
              src={cartImage}
              alt="Shopping Cart"
              className="cart-icon"
              onClick={() => handleNavigation("/cart")}
              tabIndex={0}
              aria-label="View cart"
            />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span
                  className="cart-bubble"
                  aria-label={`${getTotalQuantity()} items in cart`}
                >
                  {getTotalQuantity()}
                </span>
              </div>
            )}
          </div>
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-icon"
            onClick={handleProfileNavigation}
            tabIndex={0}
            aria-label="Navigate to profile"
          />
        </div>
      </div>

      <ul className={`menu ${menuOpen ? "show" : ""}`}>
        <li onClick={() => handleNavigation("/")}>HOME</li>
        <li onClick={() => handleNavigation("/clothing")}>CLOTHING</li>
        <li onClick={() => handleNavigation("/materials")}>MATERIALS</li>
        <li onClick={() => handleNavigation("/inspiration")}>INSPIRATION</li>
      </ul>
    </header>
  );
};

export default Navbar;
