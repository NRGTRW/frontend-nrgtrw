import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Products from "../components/Products";
import "../assets/styles/clothingPage.css";
import {
  eleganceProducts,
  pumpCoversProducts,
  confidenceProducts,
} from "../data/products";

const ClothingPage = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Clothing");

  const eleganceRef = useRef(null);
  const pumpCoversRef = useRef(null);
  const confidenceRef = useRef(null);

  useEffect(() => {
    // Scroll to the respective section and set the page title
    if (location.state?.category) {
      const { category } = location.state;

      // Update page title based on the category
      setPageTitle(category);

      // Scroll to the respective section
      if (category === "Elegance") {
        eleganceRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (category === "Pump Covers") {
        pumpCoversRef.current.scrollIntoView({ behavior: "smooth" });
      } else if (category === "Confidence") {
        confidenceRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.state]);

  return (
    <div className="clothing-page">
      {/* White Spacer Bar */}
      <div className="spacer-bar"></div>

      {/* Sections */}
      <section ref={eleganceRef}>
        <h2 className="section-title">Elegance</h2>
        <Products products={eleganceProducts} />
      </section>

      <section ref={pumpCoversRef}>
        <h2 className="section-title">Pump Covers</h2>
        <Products products={pumpCoversProducts} />
      </section>

      <section ref={confidenceRef}>
        <h2 className="section-title">Confidence</h2>
        <Products products={confidenceProducts} />
      </section>
    </div>
  );
};

export default ClothingPage;
