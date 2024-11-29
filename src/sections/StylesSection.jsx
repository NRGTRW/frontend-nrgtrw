import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/styles.css";

const StylesSection = () => {
  const categories = [
    { name: "Elegance", slug: "elegance", image: "/path-to-elegance-image.jpg" },
    { name: "Covers", slug: "covers", image: "/path-to-covers-image.jpg" },
    { name: "Confidence", slug: "confidence", image: "/path-to-confidence-image.jpg" },
  ];

  return (
    <section id="styles" className="styles-section">
      <h2>Choose Your Own Style</h2>
      <div className="styles-grid">
        {categories.map((category) => (
          <Link to={`/shop/${category.slug}`} key={category.slug} className="style-card">
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default StylesSection;
