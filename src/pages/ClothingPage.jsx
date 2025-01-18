import React from "react";
import useSWR from "swr";
import Products from "../components/Products";
import "../assets/styles/clothingPage.css";
import { fetchAllProducts } from "../services/productService";

const ClothingPage = () => {
  const { data: allProducts, error } = useSWR("/products", fetchAllProducts);

  if (error) return <p className="error-message">Failed to load products.</p>;
  if (!allProducts) return <p className="loading-message">Loading products...</p>;

  const eleganceProducts = allProducts.filter((product) => product.category === "Elegance");
  const pumpCoversProducts = allProducts.filter((product) => product.category === "Pump Covers");
  const confidenceProducts = allProducts.filter((product) => product.category === "Confidence");

  return (
    <div className="clothing-page">
      <div className="spacer-bar"></div>
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
