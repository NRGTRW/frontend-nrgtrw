import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { isLoggedIn, user } = useAuth(); // Access authentication state

  const toggleMenu = () => setMenuOpen(!menuOpen);

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

  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  // Navigation for profile
  const handleProfileNavigation = () => {
    navigate(isLoggedIn ? "/profile" : "/login");
  };

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
        <li className="logo" onClick={() => handleNavigation("/")}>
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
            src={isLoggedIn ? user.profilePicture : "../assets/images/default-avatar.webp"}
            alt="Profile"
            className="profile-icon"
            onClick={handleProfileNavigation}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
