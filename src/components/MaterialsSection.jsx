/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../assets/styles/materials.css";
import materialsImage from "../assets/images/materials.webp";

const MaterialsSection = ({ refProp }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDiscoverMore = () => {
    navigate("/materials"); // Navigate to the Materials page
  };

  return (
    <section className="materials-section" ref={refProp}>
      <div className="materials-content">
        <div className="materials-text">
          <h2>OUR MATERIALS</h2>
          <p>
            At NRG, we believe in sustainable elegance. Our materials are
            handpicked to ensure premium quality, durability, and a timeless
            aesthetic that reflects our commitment to excellence.
          </p>
          <button
            className="discover-more-button"
            onClick={handleDiscoverMore}
          >
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
