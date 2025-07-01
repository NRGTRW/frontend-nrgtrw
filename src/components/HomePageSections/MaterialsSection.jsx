/* eslint-disable react/prop-types */
import React from "react";
import { useNavigate } from "react-router-dom";
import "./materials.css";
import { useTranslation } from "react-i18next";
import materialsImage from "/images/materials.webp";

const MaterialsSection = ({ refProp }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleDiscoverMore = () => {
    navigate("/materials");
  };

  return (
    <section className="materials-section" ref={refProp}>
      <div className="materials-container">
        <div className="materials-text">
          <h2>{t("materials.title", "OUR MATERIALS")}</h2>
          <p>
            {t(
              "materials.description",
              "At NRG, we believe in the essence of sustainable elegance. Every material we use is meticulously handpicked to ensure premium quality, exceptional durability, and timeless aesthetic appeal. From luxurious fabrics to innovative textures, our commitment to excellence shines through in every piece we create."
            )}
          </p>
          <button
            className="discover-more-button"
            onClick={handleDiscoverMore}
          >
            {t("materials.button", "DISCOVER MORE")}
          </button>
        </div>
        <div className="materials-image">
          <img
            src={materialsImage}
            alt={t("materials.imageAlt", "Our Materials")}
          />
        </div>
      </div>
    </section>
  );
};

export default MaterialsSection;
