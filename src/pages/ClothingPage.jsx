import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import ProductCard from "../components/ProductCard";
import "../assets/styles/clothingPage.css";
import { fetchAllProducts } from "../services/productService";
import GoBackButton from "../components/GoBackButton";

const ClothingPage = () => {
  const { data: allProducts, error } = useSWR("/products", fetchAllProducts);
  const location = useLocation();

  // Create refs for each section
  const eleganceRef = useRef(null);
  const pumpCoversRef = useRef(null);
  const confidenceRef = useRef(null);

  useEffect(() => {
    if (location.state && location.state.category) {
      const category = location.state.category;

      setTimeout(() => {
        let targetElement = null;

        if (category === "Elegance" && eleganceRef.current) {
          targetElement = eleganceRef.current;
        } else if (category === "Pump Covers" && pumpCoversRef.current) {
          targetElement = pumpCoversRef.current;
        } else if (category === "Confidence" && confidenceRef.current) {
          targetElement = confidenceRef.current;
        }

        if (targetElement) {
          const yOffset = -80; // Offset by 80px
          const yPosition =
            targetElement.getBoundingClientRect().top +
            window.scrollY +
            yOffset;

          window.scrollTo({ top: yPosition, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.state]);

  if (error) return <p className="error-message">Failed to load products.</p>;
  if (!allProducts)
    return <p className="loading-message">Loading products...</p>;

  const eleganceProducts = allProducts.filter(
    (product) => product.categoryId === 1,
  );
  const pumpCoversProducts = allProducts.filter(
    (product) => product.categoryId === 2,
  );
  const confidenceProducts = allProducts.filter(
    (product) => product.categoryId === 3
  );

  return (
    <div className="clothing-page">
      <GoBackButton />
      <div className="spacer-bar"></div>
      <section ref={eleganceRef}>
        <h2 className="section-title">Elegance</h2>
        <ProductCard products={eleganceProducts} category="Elegance" />
      </section>
      <section ref={pumpCoversRef}>
        <h2 className="section-title">Pump Covers</h2>
        <ProductCard products={pumpCoversProducts} category="Pump Covers" />
      </section>
      <section ref={confidenceRef}>
        <h2 className="section-title">Confidence</h2>
        <ProductCard products={confidenceProducts} category="Confidence" />
      </section>
    </div>
  );
};

export default ClothingPage;
