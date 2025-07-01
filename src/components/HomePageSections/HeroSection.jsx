import React, { useRef } from "react";
import "./hero.css";
import heroImage from "/images/HeroImage.webp";
import MaterialsSection from "./MaterialsSection";

const HeroSection = () => {
  const inspirationRef = useRef(null);

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
          <h1 className="hero-title">Elegance in Strength</h1>
          <button className="hero-button" onClick={scrollToInspiration}>
            EXPLORE
          </button>
        </div>
      </section>

      <MaterialsSection refProp={inspirationRef} />
    </>
  );
};

export default HeroSection;
