import React from "react";
import "./materialsPage.css";
import { useTranslation } from "react-i18next";
import GoBackButton from "../../components/GoBackButton/GoBackButton";

const MaterialsPage = () => {
  const { t } = useTranslation();

  const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
  const materialsImage = S3_BASE + "images/materials.webp";

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
