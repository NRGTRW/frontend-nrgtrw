import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import "./hero.css";
import heroImage from "/images/HeroImage.webp";
import MaterialsSection from "./MaterialsSection";

const HeroSection = () => {
  const inspirationRef = useRef(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const scrollToInspiration = () => {
    inspirationRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="hero-section">
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="hero-content">
          <h1 className="hero-title">{t("hero.title", "Elegance in Strength")}</h1>
          <div style={{ display: 'flex', gap: '18px', justifyContent: 'center' }}>
            <button className="hero-button" onClick={scrollToInspiration}>
              {t("hero.button", "EXPLORE")}
            </button>
            <button
              className="hero-services-button"
              onClick={() => navigate("/NRGLandingPage")}
            >
               SERVICES 
            </button>
          </div>
        </div>
      </section>

      <MaterialsSection refProp={inspirationRef} />
    </>
  );
};

export default HeroSection;
