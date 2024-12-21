import React, { useState } from "react";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png"; // Ensure this path is correct.

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const closeMenuOnOutsideClick = (e) => {
    if (!e.target.closest(".menu") && !e.target.closest(".menu-toggle")) {
      setMenuOpen(false);
    }
  };

  return (
    <header onClick={closeMenuOnOutsideClick}>
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
