import React from "react";
import "./DesignPage.css";

const DesignPage = () => {
  return (
    <div className="design-page">
      <section className="design-hero">
        <h1 className="design-title">Design That Inspires</h1>
        <p className="design-subtitle">
          Where luxury meets innovation. Every detail, every line, every texture is crafted to elevate your experience.
        </p>
      </section>
      <section className="design-showcase">
        <div className="design-card">
          <img src="/images/HeroImageClothingPage.webp" alt="Signature Silhouette" />
          <h2>Signature Silhouette</h2>
          <p>Timeless forms, modern edge. Our pieces are designed to flatter and empower.</p>
        </div>
        <div className="design-card">
          <img src="/images/materials.webp" alt="Premium Materials" />
          <h2>Premium Materials</h2>
          <p>Only the finest, most sustainable fabrics. Feel the difference in every touch.</p>
        </div>
        <div className="design-card">
          <img src="/images/ShowOff.webp" alt="Attention to Detail" />
          <h2>Attention to Detail</h2>
          <p>From golden accents to hidden seams, luxury is found in the smallest moments.</p>
        </div>
      </section>
      <section className="design-philosophy">
        <h2>Our Design Philosophy</h2>
        <p>
          At NRG, design is more than aesthetics—it's a statement. We believe in the power of subtlety, the allure of contrast, and the confidence that comes from wearing something truly exceptional. Our vision is to blend classic elegance with bold innovation, creating pieces that stand the test of time and trend.
        </p>
      </section>
    </div>
  );
};

export default DesignPage; 