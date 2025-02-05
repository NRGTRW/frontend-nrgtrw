import React, { useState } from "react";
import { createProduct } from "../services/productService";
import "../assets/styles/admin.css";

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
    <form onSubmit={handleSubmit} className="admin-form glass">
      <h2 className="admin-form-title">Add New Product</h2>
      
      <input
        type="text"
        name="name"
        className="admin-input"
        placeholder="Product Name"
        onChange={handleChange}
        required
      />
      
      <input
        type="number"
        name="price"
        className="admin-input"
        placeholder="Price"
        onChange={handleChange}
        required
      />
      
      <textarea
        name="description"
        className="admin-input"
        placeholder="Description"
        onChange={handleChange}
        required
      />
      
      <input
        type="number"
        name="stock"
        className="admin-input"
        placeholder="Stock"
        onChange={handleChange}
        required
      />
      
      <input
        type="number"
        name="categoryId"
        className="admin-input"
        placeholder="Category ID"
        onChange={handleChange}
        required
      />
      
      <div className="admin-file-upload">
        <label className="admin-btn secondary">
          Upload Images
          <input 
            type="file" 
            multiple 
            onChange={handleImageChange} 
            required 
            hidden
          />
        </label>
      </div>
      
      <button 
        type="submit" 
        className="admin-btn primary"
      >
        Publish Product
      </button>
    </form>
  );
};

export default ProductForm;