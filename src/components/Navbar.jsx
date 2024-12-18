import React, { useState, useRef, useEffect } from "react";
import "../assets/styles/navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Toggle Menu
  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent closeMenu logic when button is clicked
    setMenuOpen((prev) => !prev);
  };

  // Close menu on outside click
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-top">
        {/* Hamburger Menu */}
        <div
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Logo */}
        <h1 className="navbar-logo">NRG</h1>

        {/* Cart Icon */}
        <div className="cart-icon">🛒</div>
      </div>

      {/* Side Menu */}
      <nav
        className={`side-menu ${menuOpen ? "open" : ""}`}
        ref={menuRef}
      >
        <ul>
          {["HOME", "ELEGANCE", "PUMP COVERS", "CONFIDENCE", "ABOUT US", "FAQS", "CONTACT US", "MY ORDER", "SOCIAL MEDIA"].map((item) => (
            <li key={item}>
              <a href={`#${item.toLowerCase().replace(" ", "-")}`}>
                {item} <span className="arrow">&lt;</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
