import React from "react";
import "./hamburgerIcon.css";

const HamburgerIcon = ({ isOpen, toggleMenu, buttonRef }) => {
  return (
    <button
      ref={buttonRef}
      className={`menu-toggle ${isOpen ? "open" : ""}`}
      onClick={toggleMenu}
      aria-label="Toggle Menu"
    >
      <svg
        className="hamburger-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="35"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path className="top-bar" d="M4 6h16" />
        <path className="middle-bar" d="M4 12h16" />
        <path className="bottom-bar" d="M4 18h16" />
      </svg>
    </button>
  );
};

export default HamburgerIcon;
