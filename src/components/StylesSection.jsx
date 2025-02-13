import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/styles.css";
import eleganceImage from "/images/style-elegance.png";
import coversImage from "/images/style-covers.webp";
import confidenceImage from "/images/ShowOff.webp";

const StylesSection = () => {
  const { t } = useTranslation();

  const stylesData = [
    {
      title: t("styles.elegance", "ELEGANCE"),
      image: eleganceImage,
      link: "/clothing",
      category: "Elegance",
    },
    {
      title: t("styles.pumpCovers", "PUMP COVERS"),
      image: coversImage,
      link: "/clothing",
      category: "Pump Covers",
    },
    {
      title: t("styles.confidence", "CONFIDENCE"),
      image: confidenceImage,
      link: "/clothing",
      category: "Confidence",
    },
  ];

  return (
    <section className="styles-section">
      <h2>{t("styles.header", "CHOOSE YOUR STYLE")}</h2>
      <div className="styles-grid">
        {stylesData.map((style, index) => (
          <Link
            to={{ pathname: style.link }}
            state={{ category: style.category }}
            key={index}
            className="style-card"
          >
            <div
              className="style-image"
              style={{ backgroundImage: `url(${style.image})` }}
            >
              <div className="style-overlay">
                <h3>{style.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default StylesSection;
