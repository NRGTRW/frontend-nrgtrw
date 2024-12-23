import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/navbar.css";
import cartImage from "../assets/images/shopping-cart.png";
// import instagramIcon from "../assets/images/instagram-icon.png";
// import tiktokIcon from "../assets/images/tiktok-icon.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleClickOutside = (e) => {
    if (!e.target.closest(".menu") && !e.target.closest(".menu-toggle")) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
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
        <li className="logo" onClick={() => handleNavigation("/")}>
          NRG
        </li>
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
        <li onClick={() => handleNavigation("/clothing")}>CLOTHING</li>
        {/* <li className="social-media-icons">
          <a
            href="https://www.instagram.com/nrgoranov/reels/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-media-item instagram"
          >
            <img src={instagramIcon} alt="Instagram" />
            <span>INSTAGRAM</span>
            <img src={instagramIcon} alt="Instagram" />

          </a>
          <a
            href="https://www.tiktok.com/@nrgoranov"
            target="_blank"
            rel="noopener noreferrer"
            className="social-media-item tiktok"
          >
            <img src={tiktokIcon} alt="TikTok" />
            <span>TIKTOK</span>
          </a>
        </li> */}
      </ul>
    </header>
  );
};

export default Navbar;
