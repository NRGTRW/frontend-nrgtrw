import React from "react";
import { useNavigate } from "react-router-dom";
import "./inspiration.css";
import { useTranslation } from "react-i18next";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
const inspirationImage = S3_BASE + "images/inspiration.webp";

const InspirationSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLearnMore = () => {
    navigate("/inspiration");
  };

  return (
    <section className="inspiration-section">
      <div className="inspiration-container">
        <div className="inspiration-image">
          <img
            src={inspirationImage}
            alt={t("inspiration.imageAlt", "Our Inspiration")}
          />
        </div>
        <div className="inspiration-text">
          <h2>{t("inspiration.title", "OUR INSPIRATION")}</h2>
          <p>
            {t(
              "inspiration.description",
              "At NRG, we draw inspiration from the elegance of nature and the strength of innovation. Each piece is crafted to reflect balance and purpose.",
            )}
          </p>
          <button className="learn-more-button" onClick={handleLearnMore}>
            {t("inspiration.button", "LEARN MORE")}
          </button>
        </div>
      </div>
    </section>
  );
};

export default InspirationSection;
