import React from "react";
import { useTranslation } from "react-i18next";
import "../assets/styles/inspirationPage.css";
import inspirationImage from "/images/inspiration.webp"; // Add your image here
import GoBackButton from "../components/GoBackButton";

const InspirationPage = () => {
  const { t } = useTranslation();

  return (
    <div className="inspiration-page">
      <GoBackButton />
      <div className="inspiration-content">
        <div className="image-section" data-aos="fade-right">
          <img 
            src={inspirationImage} 
            alt={t("inspirationPage.imageAlt", "Inspired Design")} 
          />
        </div>
        <div className="text-section">
          <h1 data-aos="fade-up">
            {t("inspirationPage.title", "Our Inspiration")}
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">
            {t(
              "inspirationPage.content",
              "At NRG, inspiration flows from the elegance of nature and the strength of innovation. We draw ideas from the dynamic balance between functionality and artistry, crafting every collection to tell a unique story. Whether it's the bold lines of modern architecture or the calming hues of the natural world, our designs are rooted in purpose and creativity."
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InspirationPage;
