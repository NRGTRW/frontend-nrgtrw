import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/styles.css";
import eleganceImage from "../assets/images/style-elegance.png";
import coversImage from "../assets/images/style-covers.webp";
import confidenceImage from "../assets/images/ShowOff.webp";

const StylesSection = () => {
  const stylesData = [
    {
      title: "ELEGANCE",
      image: eleganceImage,
      link: "/clothing",
    },
    {
      title: "PUMP COVERS",
      image: coversImage,
      link: "/clothing",
    },
    {
      title: "CONFIDENCE",
      image: confidenceImage,
      link: "/clothing",
    },
  ];

  return (
    <section className="styles-section">
      <h2>CHOOSE YOUR STYLE</h2>
      <div className="styles-grid">
        {stylesData.map((style, index) => (
          <Link to={style.link} key={index} className="style-card">
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
