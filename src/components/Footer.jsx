import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/footer.css";
import instagramIcon from "/images/instagram-icon.png";
import tiktokIcon from "/images/tiktok-icon.png";

const Footer = () => {
  const handleNavigation = (path) => {
    navigate(path);
  };
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div
          className="footer-logo"
          onClick={() => handleNavigation("/")}
          aria-label="Navigate to home"
        >
          <h1>NRG</h1>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <ul>
            <li>
              <a href="/about-us">About Us</a>
            </li>
            <li>
              <a href="/contact-us">Contact Us</a>
            </li>
            <li>
              <a href="/faqs">FAQs</a>
            </li>
            <li>
              <a href="/my-order">My Order</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-social">
          <a
            href="https://www.instagram.com/nrgoranov/reels/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagramIcon} alt="Instagram" />
          </a>
          <a
            href="https://www.tiktok.com/@nrgoranov"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktokIcon} alt="TikTok" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>© {new Date().getFullYear()} NRG. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
