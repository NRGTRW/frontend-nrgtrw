import React, { useState } from "react";
import { createProduct } from "../services/productService";
import "../assets/styles/ProductForm.css"

const ProductForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
    images: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(formData);
      onSuccess();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input type="text" name="name" placeholder="Product Name" onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="number" name="stock" placeholder="Stock" onChange={handleChange} required />
      <input type="number" name="categoryId" placeholder="Category ID" onChange={handleChange} required />
      <input type="file" multiple onChange={handleImageChange} required />
      <button type="submit">Publish Product</button>
    </form>
  );
};

export default ProductForm;
