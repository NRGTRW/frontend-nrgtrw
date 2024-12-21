import React, { useState, useEffect } from "react";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

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
          onClick={() => alert("Redirecting to shopping cart!")}
        />
      </div>

      {/* Sliding Menu */}
      <ul className={`menu ${menuOpen ? "show" : ""}`}>
        <li>
          <a href="#home">HOME</a>
        </li>
        <li>
          <a href="#elegance">ELEGANCE</a>
        </li>
        <li>
          <a href="#pump-covers">PUMP COVERS</a>
        </li>
        <li>
          <a href="#confidence">CONFIDENCE</a>
        </li>
        <li>
          <a href="#social">SOCIAL MEDIA</a>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
