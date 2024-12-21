import React from "react";
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo">
          <h1>NRG</h1>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/my-order">My Order</a></li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
            <i className="fab fa-instagram"></i>
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
