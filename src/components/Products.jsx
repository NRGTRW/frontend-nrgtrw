import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../assets/styles/productCard.css";

const Products = ({ products }) => {
  const navigate = useNavigate(); // Hook for navigation

  if (!products || products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const [selectedColorIndex, setSelectedColorIndex] = useState(0); // Track selected color index
        const currentColor = product.colors?.[selectedColorIndex];

        const handleImageClick = () => {
          // Navigate to the ProductPage with the selected color
          navigate(`/product/${product.id}`, {
            state: { selectedColor: currentColor },
          });
        };

        return (
          <div key={product.id} className="product-card">
            {/* Image Container */}
            <div
              className="image-container"
              onClick={handleImageClick} // Redirect on click
              style={{ cursor: "pointer" }}
            >
              <img
                src={currentColor?.imageUrl || product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <img
                src={currentColor?.hoverImage || product.imageUrl}
                alt={`${product.name} hover`}
                className="hover-image"
              />
            </div>

            {/* Hover Overlay */}
            <div className="hover-overlay">
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>
              <div className="color-options">
                {product.colors?.map((color, index) => (
                  <div
                    key={`color-${index}`}
                    className={`color-circle ${
                      index === selectedColorIndex ? "selected" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${color.imageUrl})`, // Set the background image
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the parent click
                      setSelectedColorIndex(index); // Set the selected color
                    }}
                    title={color.colorName} // Tooltip for color name
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
