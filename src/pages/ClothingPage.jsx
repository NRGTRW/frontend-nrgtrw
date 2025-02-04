import React from "react";
import useSWR from "swr";
import ProductCard from "../components/ProductCard";
import "../assets/styles/clothingPage.css";
import { fetchAllProducts } from "../services/productService";

const categoryMapping = {
  1: "Elegance", // Maps categoryId 1 to "Elegance"
  2: "Pump Covers", // Maps categoryId 2 to "Pump Covers"
  // 3: "Confidence", // Add more mappings if necessary
};

const ClothingPage = () => {
  const { data: allProducts, error } = useSWR("/products", fetchAllProducts);

  if (error) return <p className="error-message">Failed to load products.</p>;
  if (!allProducts) return <p className="loading-message">Loading products...</p>;

  console.log("All products fetched:", allProducts);

  const eleganceProducts = allProducts.filter(
    (product) => product.categoryId === 1
  );
  const pumpCoversProducts = allProducts.filter(
    (product) => product.categoryId === 2
  );
  // const confidenceProducts = allProducts.filter(
  //   (product) => product.categoryId === 3
  // );

  console.log("Elegance Products:", eleganceProducts);
  console.log("Pump Covers Products:", pumpCoversProducts);
  // console.log("Confidence Products:", confidenceProducts);

  return (
    <div className="clothing-page">
      <div className="spacer-bar"></div>
      <section>
        <h2 className="section-title">Elegance</h2>
        <ProductCard products={eleganceProducts} category="Elegance" />
      </section>
      <section>
        <h2 className="section-title">Pump Covers</h2>
        <ProductCard products={pumpCoversProducts} category="Pump Covers" />
      </section>
      {/* <section>
        <h2 className="section-title">Confidence</h2>
        <ProductCard products={confidenceProducts} category="Confidence" />
      </section> */}
    </div>
  );
};

export default ClothingPage;
