import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // React Router navigation

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close the menu if clicked outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(".menu") && !e.target.closest(".menu-toggle")) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener when the menu is open
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Handle menu item click
  const handleNavigation = (path) => {
    setMenuOpen(false); // Close the menu after clicking
    navigate(path);
  };

  return (
    <header>
      {/* Top Bar */}
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
        <div className="logo">NRG</div>
        <img
          src={cartImage}
          alt="Shopping Cart"
          className="cart-icon"
          onClick={() => handleNavigation("/cart")}
        />
      </div>

      {/* Sliding Menu */}
      <ul className={`menu ${menuOpen ? "show" : ""}`}>
        <li onClick={() => handleNavigation("/")}>HOME</li>
        <li onClick={() => handleNavigation("/categories/elegance")}>
          ELEGANCE
        </li>
        <li onClick={() => handleNavigation("/categories/pump-covers")}>
          PUMP COVERS
        </li>
        <li onClick={() => handleNavigation("/categories/confidence")}>
          CONFIDENCE
        </li>
        <li onClick={() => handleNavigation("/social-media")}>SOCIAL MEDIA</li>
      </ul>
    </header>
  );
};

export default Navbar;
