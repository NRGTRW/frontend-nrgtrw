import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";
import defaultProfilePicture from "/default-profile.webp";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { isLoggedIn, user } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleNavigation = (path) => {
    setMenuOpen(false); // Close menu on navigation
    navigate(path);
  };

  const handleProfileNavigation = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".menu") && !e.target.closest(".menu-toggle")) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header>
      <div className="top-bar">
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu Toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <li
          className="logo"
          onClick={() => handleNavigation("/")}
          aria-label="Navigate to home"
        >
          NRG
        </li>
        <div className="right-container">
          <div className="cart-container">
            <img
              src={cartImage}
              alt="Shopping Cart"
              className="cart-icon"
              onClick={() => handleNavigation("/cart")}
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
            src={user?.profilePicture || defaultProfilePicture}
            alt="Profile"
            className="profile-icon"
            onClick={handleProfileNavigation}
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
