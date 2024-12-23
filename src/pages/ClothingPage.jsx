import React from "react";
import Products from "../components/Products";
import "../assets/styles/clothingPage.css";
import {
  eleganceProducts,
  pumpCoversProducts,
  confidenceProducts,
} from "../data/products";

const ClothingPage = () => {
  return (
    <div className="clothing-page">

      {/* White Spacer Bar */}
      <div className="spacer-bar"></div>

      {/* Sections */}
      <section>
        <h2 className="section-title">Elegance</h2>
        <Products products={eleganceProducts} />
      </section>

      <section>
        <h2 className="section-title">Pump Covers</h2>
        <Products products={pumpCoversProducts} />
      </section>

      <section>
        <h2 className="section-title">Confidence</h2>
        <Products products={confidenceProducts} />
      </section>
    </div>
  );
};

export default ClothingPage;
