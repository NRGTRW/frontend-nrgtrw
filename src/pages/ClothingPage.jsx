import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Products from "../components/Products";
import "../assets/styles/clothingPage.css";
import { fetchItems } from "../services/itemService";

const ClothingPage = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState("Clothing");

  const eleganceRef = useRef(null);
  const pumpCoversRef = useRef(null);
  const confidenceRef = useRef(null);

  const [eleganceProducts, setEleganceProducts] = useState([]);
  const [pumpCoversProducts, setPumpCoversProducts] = useState([]);
  const [confidenceProducts, setConfidenceProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await fetchItems();

        const elegance = allProducts.filter(
          (product) => product.category === "Elegance"
        );
        const pumpCovers = allProducts.filter(
          (product) => product.category === "Pump Covers"
        );
        const confidence = allProducts.filter(
          (product) => product.category === "Confidence"
        );

        setEleganceProducts(elegance);

        // Swap data for Pump Covers and Confidence
        setPumpCoversProducts(confidence);
        setConfidenceProducts(pumpCovers);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      const { category } = location.state;
      setPageTitle(category);

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
      <div className="spacer-bar"></div>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ClothingPage;
