import React from "react";
import "../assets/styles/materials.css";
import materialsImage from "../assets/images/icecream-materials.webp";

const MaterialsSection = () => {
  return (
    <section className="materials-section">
      <div className="materials-content">
        <div className="materials-text">
          <h2>OUR MATERIALS</h2>
          <p>
            At NRG, we believe in sustainable elegance. Our materials are handpicked to ensure premium quality,
            durability, and a timeless aesthetic that reflects our commitment to excellence.
          </p>
          <button className="discover-more-button">DISCOVER MORE</button>
        </div>
        <div className="materials-image">
          <img src={materialsImage} alt="Our Materials" />
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
