import React from "react";
import "../assets/styles/materialsPage.css";
import materialsImage from "../assets/images/materials.webp"; // Add your image here
import GoBackButton from "../components/GoBackButton";

const MaterialsPage = () => {
  return (
    <div className="materials-page">
                <GoBackButton/>

      <div className="materials-content">
        <div className="text-section">
          <h1 data-aos="fade-up">Our Materials</h1>
          <p data-aos="fade-up" data-aos-delay="200">
            At NRG, we believe in the essence of sustainable elegance. Every
            material we use is meticulously handpicked to ensure premium
            quality, exceptional durability, and timeless aesthetic appeal. From
            luxurious fabrics to innovative textures, our commitment to
            excellence shines through in every piece we create.
          </p>
        </div>
        <div className="image-section" data-aos="fade-left">
          <img src={materialsImage} alt="Premium Materials" />
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
