import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/footer.css";
import instagramIcon from "/images/instagram-icon.png";
import tiktokIcon from "/images/tiktok-icon.png";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div
          className="footer-logo"
          onClick={() => handleNavigation("/")}
          aria-label={t("footer.logoAria", "Navigate to home")}
        >
          <h1>NRG</h1>
        </div>

        {/* Navigation Links */}
        <div className="footer-nav">
          <ul>
            <li>
              <a href="/about-us">{t("footer.aboutUs", "About Us")}</a>
            </li>
            <li>
              <a href="/contact-us">{t("footer.contactUs", "Contact Us")}</a>
            </li>
            <li>
              <a href="/faqs">{t("footer.faqs", "FAQs")}</a>
            </li>
            <li>
              <a href="/my-order">{t("footer.myOrder", "My Order")}</a>
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
            <img src={instagramIcon} alt={t("footer.instagram", "Instagram")} />
          </a>
          <a
            href="https://www.tiktok.com/@nrgoranov"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={tiktokIcon} alt={t("footer.tiktok", "TikTok")} />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>
          © {new Date().getFullYear()} NRG. {t("footer.rights", "All rights reserved.")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
