import React, { useEffect, useState } from "react";
import Products from "../components/Products";
import { fetchItems } from "../services/itemService";
import "../assets/styles/clothingPage.css";

const ClothingPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await fetchItems();
        setProducts(allProducts);
      } catch (err) {
        setError("Failed to load products.");
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="clothing-page">
      <Products products={products} />
    </div>
  );
};

export default ClothingPage;
