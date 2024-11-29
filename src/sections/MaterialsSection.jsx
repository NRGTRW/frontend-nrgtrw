import React from "react";
import "../assets/styles/materials.css";

const MaterialsSection = () => {
  return (
    <section id="materials" className="materials-section">
      <img src="/path-to-material-image.jpg" alt="Material" />
      <div className="materials-content">
        <h2>Our Materials</h2>
        <p>Picked, manufactured, delivered from us.</p>
        <button>Read More</button>
      </div>
    </section>
  );
};

export default MaterialsSection;
