/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/materials.css";
import materialsImage from "../assets/images/materials.webp";

const MaterialsSection = ({ refProp }) => {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate("/materials");
  };

  return (
    <section className="materials-section" ref={refProp}>
      <div className="materials-container">
        <div className="materials-text">
          <h2>OUR MATERIALS</h2>
          <p>
            At NRG, we believe in the essence of sustainable elegance. Every
            material we use is meticulously handpicked to ensure premium
            quality, exceptional durability, and timeless aesthetic appeal. From
            luxurious fabrics to innovative textures, our commitment to
            excellence shines through in every piece we create.
          </p>
          <button className="discover-more-button" onClick={handleDiscoverMore}>
            DISCOVER MORE
          </button>
        </div>
        <div className="materials-image">
          <img src={materialsImage} alt="Our Materials" />
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
