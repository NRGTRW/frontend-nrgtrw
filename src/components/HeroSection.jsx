import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import "../assets/styles/hero.css";
import heroImage from "/images/HeroImage.webp";
import MaterialsSection from "./MaterialsSection";

const HeroSection = () => {
  const inspirationRef = useRef(null);
  const { t } = useTranslation();

  const scrollToInspiration = () => {
    inspirationRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div
          className="hero-background"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        <div className="hero-content">
          <h1 className="hero-title">{t("hero.title", "Elegance in Strength")}</h1>
          <button className="hero-button" onClick={scrollToInspiration}>
            {t("hero.button", "EXPLORE")}
          </button>
        </div>
      </section>

      {/* Inspiration Section */}
      <MaterialsSection refProp={inspirationRef} />
    </>
  );
};

export default HeroSection;
