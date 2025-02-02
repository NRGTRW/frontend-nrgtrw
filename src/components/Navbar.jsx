import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import useSWR from "swr";
import api from "../services/api";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "../assets/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import heartFilled from "/wishlist-filled.png";
import "../assets/styles/navbar.css";
import CartPreview from "./CartPreview"; // Import the CartPreview component

// Helper to retrieve auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// SWR fetcher for profile data
const fetcher = async (url) => {
  const token = getAuthToken();
  if (!token) {
    console.warn("Skipping profile fetch: No auth token.");
    return null;
  }
  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.status);
    if (error.response?.status === 401) {
      console.warn("Token might be expired. Logging out.");
      localStorage.removeItem("authToken");
    }
    return null;
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false); // local state to show/hide the cart preview
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const { getTotalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  // Fetch profile information with SWR (refreshes every 3 seconds if logged in)
  const { data: profile } = useSWR(
    getAuthToken() ? "/profile" : null,
    fetcher,
    { refreshInterval: getAuthToken() ? 3000 : 0 }
  );

  // Close mobile menu when clicking outside of it
  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target)
      )
        return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isLoggedIn = !!profile;
  const handleAuthenticatedNavigation = (protectedPath, fallbackPath) => {
    if (isLoggedIn) handleNavigation(protectedPath);
    else handleNavigation(fallbackPath);
  };

  // Determine profile picture (or fallback to default)
  const profilePicture = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/${profile.profilePicture}`
    : defaultProfilePicture;

  // Handlers to show/hide the cart preview when hovering over the cart icon
  const handleCartMouseEnter = () => {
    setShowCartPreview(true);
  };

  const handleCartMouseLeave = () => {
    setShowCartPreview(false);
  };

  return (
    <header className="navbar">
      <div className="top-bar">
        {/* Hamburger Menu Button */}
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

        <div className="right-container">
          {/* Wishlist Icon */}
          <div className="wishlist-container" style={{ position: "relative" }}>
            <img
              src={wishlistCount > 0 ? heartFilled : heartOutline}
              alt="Wishlist"
              className="wishlist-icon"
              onClick={() =>
                handleAuthenticatedNavigation("/wishlist", "/login")
              }
              tabIndex={0}
              aria-label="Navigate to wishlist"
            />
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </div>

          {/* Cart Icon with Cart Preview */}
          <div
            className="cart-container"
            onMouseEnter={handleCartMouseEnter}
            onMouseLeave={handleCartMouseLeave}
            style={{ position: "relative" }} // Ensure proper positioning for the pop-up
          >
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
            {showCartPreview && <CartPreview />}
          </div>

          {/* Profile Icon */}
          <img
            src={profilePicture}
            alt="Profile"
            className="profile-icon"
            onError={(e) => (e.target.src = defaultProfilePicture)}
            onClick={() =>
              handleAuthenticatedNavigation("/profile", "/login")
            }
            tabIndex={0}
            aria-label="Navigate to profile"
          />
        </div>
      </div>

      {/* Mobile Menu */}
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
