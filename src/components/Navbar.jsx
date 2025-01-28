import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useProfile } from "../context/ProfileContext";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "../assets/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for outside-click detection
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { profile } = useProfile();

  // Close hamburger menu if user clicks outside the menu & button
  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(e) {
      // If click is inside the menu OR on the button, do nothing
      if (
        menuRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target)
      ) {
        return;
      }
      // Otherwise, click is truly outside => close menu
      setMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Toggling the menu
  const toggleMenu = () => {
    setMenuOpen((prev) => {
      console.log("Toggling from:", prev, "to:", !prev);
      return !prev;
    });
  };

  // Navigation helpers
  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // Check login status from profile
  const isLoggedIn = !!profile;

  // Decide if route is protected; if not logged in, go to login
  const handleAuthenticatedNavigation = (protectedPath, fallbackPath) => {
    if (isLoggedIn) handleNavigation(protectedPath);
    else handleNavigation(fallbackPath);
  };

  // Build final profile image URL
  let profilePicture = defaultProfilePicture;
  if (profile?.profilePicture) {
    if (/^https?:\/\//.test(profile.profilePicture)) {
      // If it's already a full URL
      profilePicture = profile.profilePicture;
    } else {
      // else prepend your base URL
      const baseImageUrl =
        import.meta.env.VITE_IMAGE_BASE_URL ||
        "https://nrgtrw-images.s3.eu-central-1.amazonaws.com";
      profilePicture = `${baseImageUrl}/${profile.profilePicture}`;
    }
  }

  return (
    <header className="navbar">
      <div className="top-bar">
        {/* Hamburger menu icon */}
        <button
          ref={buttonRef}
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo */}
        <li
          className="logo"
          onClick={() => handleNavigation("/")}
          tabIndex={0}
          aria-label="Navigate to home"
        >
          NRG
        </li>

        {/* Right side icons */}
        <div className="right-container">
          {/* Wishlist */}
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

          {/* Cart */}
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

          {/* Profile picture */}
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-icon"
            onError={(e) => {
              // fallback if the image fails
              e.target.src = defaultProfilePicture;
            }}
            onClick={() => handleAuthenticatedNavigation("/profile", "/login")}
            tabIndex={0}
            aria-label="Navigate to profile"
          />
        </div>
      </div>

      {/* Menu (closes on outside click) */}
      <ul ref={menuRef} className={`menu ${menuOpen ? "show" : ""}`}>
        <li onClick={() => handleNavigation("/")}>HOME</li>
        <li onClick={() => handleNavigation("/clothing")}>CLOTHING</li>
        <li onClick={() => handleNavigation("/materials")}>MATERIALS</li>
        <li onClick={() => handleNavigation("/inspiration")}>INSPIRATION</li>
      </ul>
    </header>
  );
};

export default Navbar;
