import React from "react";
import "../assets/styles/materials.css";
import icecreamMaterials from "../assets/images/icecream-materials.webp";

const MaterialsSection = () => {
  return (
    <section className="materials-section">
      <img src={icecreamMaterials} alt="Materials Ice Cream" />
      <h2>OUR MATERIALS</h2>
      <p>GET PICKED, MANUFACTURED, DELIVERED FROM US</p>
      <a href="#" className="read-more">READ MORE</a>
    </section>
  );
};

export default MaterialsSection;
