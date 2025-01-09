import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";
import defaultProfilePicture from "../assets/images/default-profile.webp";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getTotalQuantity } = useCart();
  const { user } = useAuth();

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
            />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span className="cart-bubble">
                  {getTotalQuantity()}
                </span>
              </div>
            )}
          </div>
          <img
            src={user?.profilePicture || defaultProfilePicture}
            alt="Profile"
            className="profile-icon"
            onClick={() => handleNavigation("/profile")}
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
