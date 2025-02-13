import React from "react";
import { useTranslation } from "react-i18next";
import "../assets/styles/materialsPage.css";
import materialsImage from "/images/materials.webp"; 
import GoBackButton from "../components/GoBackButton";

const MaterialsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="materials-page">
      <GoBackButton />

      <div className="materials-content">
        <div className="text-section">
          <h1 data-aos="fade-up">
            {t("materialsPage.title", "Our Materials")}
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">
            {t(
              "materialsPage.content",
              "At NRG, we believe in the essence of sustainable elegance. Every material we use is meticulously handpicked to ensure premium quality, exceptional durability, and timeless aesthetic appeal. From luxurious fabrics to innovative textures, our commitment to excellence shines through in every piece we create."
            )}
          </p>
        </div>
        <div className="image-section" data-aos="fade-left">
          <img 
            src={materialsImage} 
            alt={t("materialsPage.imageAlt", "Premium Materials")} 
          />
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
