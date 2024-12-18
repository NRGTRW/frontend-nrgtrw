import React from "react";
import "../assets/styles/hero.css";
import heroImage from "../assets/images/HeroImage.webp";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      <div className="hero-content">
        <h1 className="hero-title">Elegance in Strength</h1>
        <button className="hero-button">EXPLORE</button>
      </div>
    </section>
  );
};

export default HeroSection;
