import React, { useState } from "react";
import "../assets/styles/navbar.css";

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
        <div className="logo">NRG</div>
        <div className="cart-icon">🛒</div>
      

      {/* Navbar */}
      <nav className="navbar">
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu Toggle"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
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
          <a href="#about">ABOUT US</a>
        </li>
        <li>
          <a href="#faqs">FAQs</a>
        </li>
        <li>
          <a href="#contact">CONTACT US</a>
        </li>
        <li>
          <a href="#order">MY ORDER</a>
        </li>
        <li>
          <a href="#social">SOCIAL MEDIA</a>
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
