import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import useSWR from "swr";
import api from "../services/api";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "../assets/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import heartFilled from "/wishlist-filled.png";
import "../assets/styles/navbar.css";

const getAuthToken = () => localStorage.getItem("authToken");

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
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { wishlist } = useWishlist();

  const { data: profile } = useSWR(getAuthToken() ? "/profile" : null, fetcher, {
    refreshInterval: getAuthToken() ? 5000 : 0,
  });

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const profilePicture = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/${profile.profilePicture}`
    : defaultProfilePicture;

  return (
    <header className="navbar">
      <div className="top-bar">
        <button ref={buttonRef} className={`menu-toggle ${menuOpen ? "open" : ""}`} onClick={toggleMenu} aria-label="Toggle Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <li className="logo" onClick={() => handleNavigation("/")} tabIndex={0} aria-label="Navigate to home">
          NRG
        </li>

        <div className="right-container">
          <div className="wishlist-container">
            <img
              src={wishlist.length > 0 ? heartFilled : heartOutline}
              alt="Wishlist"
              className="wishlist-icon"
              onClick={() => handleAuthenticatedNavigation("/wishlist", "/login")}
              tabIndex={0}
              aria-label="Navigate to wishlist"
            />
          </div>

          <div className="cart-container">
            <img src={cartImage} alt="Shopping Cart" className="cart-icon" onClick={() => handleNavigation("/cart")} tabIndex={0} aria-label="View cart" />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span className="cart-bubble" aria-label={`${getTotalQuantity()} items in cart`}>
                  {getTotalQuantity()}
                </span>
              </div>
            )}
          </div>

          <img
            src={profilePicture}
            alt="Profile"
            className="profile-icon"
            onError={(e) => (e.target.src = defaultProfilePicture)}
            onClick={() => handleAuthenticatedNavigation("/profile", "/login")}
            tabIndex={0}
            aria-label="Navigate to profile"
          />
        </div>
      </div>

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
