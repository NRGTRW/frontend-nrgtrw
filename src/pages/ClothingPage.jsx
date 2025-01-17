// Updated ClothingPage.jsx\import React from "react";
import useSWR from "swr";
import axios from "axios";
import "../assets/styles/clothingPage.css";

const fetchAllProducts = async () => {
  try {
    const response = await axios.get("https://nrgtrw-images.s3.eu-central-1.amazonaws.com/products/products.json");
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

const ClothingPage = () => {
  const { data: products, error } = useSWR("/products", fetchAllProducts);

  if (error) return <p>Error loading products: {error.message}</p>;
  if (!products) return <p>Loading...</p>;

  return (
    <div className="clothing-page">
      <h1>Clothing Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt={product.name} width="100" />
            <p>{product.name}</p>
            <p>${product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClothingPage;