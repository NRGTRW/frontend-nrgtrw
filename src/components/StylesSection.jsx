import React from "react";
import "../assets/styles/styles.css";
// import styleElegance from "../assets/images/style-elegance.png";
// import styleCovers from "../assets/images/style-covers.png";
// import styleConfidence from "../assets/images/style-confidence.png";

const StylesSection = () => {
  return (
    <section className="styles-section">
      <h2>STYLES</h2>
      <p>CHOOSE YOUR OWN</p>
      <div className="styles-grid">
        <div className="style-card">
          {/* <img src={styleElegance} alt="Elegance" /> */}
          <h3>ELEGANCE</h3>
        </div>
        <div className="style-card">
          {/* <img src={styleCovers} alt="Covers" /> */}
          <h3>COVERS</h3>
        </div>
        <div className="style-card">
          {/* <img src={styleConfidence} alt="Confidence" /> */}
          <h3>CONFIDENCE</h3>
        </div>
      </div>
    </section>
  );
};

export default StylesSection;
