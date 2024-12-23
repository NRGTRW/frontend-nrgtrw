/* eslint-disable react/prop-types */
import React, { useState } from "react";
import "../assets/styles/products.css";

// eslint-disable-file react/prop-types
const Products = ({ products }) => {
  const [activeColors, setActiveColors] = useState({});

  const handleColorChange = (productId, colorIndex) => {
    setActiveColors({ ...activeColors, [productId]: colorIndex });
  };

  return (
    <div className="product-grid">
      {products.map((product) => {
        const activeColorIndex = activeColors[product.id] || 0;

        return (
          <div className="product-card" key={product.id}>
            <div className="image-container">
              <img
                src={product.colors[activeColorIndex].image}
                alt={product.name}
                className="product-image"
              />
              <img
                src={product.colors[activeColorIndex].hoverImage}
                alt={`${product.name} Hover`}
                className="hover-image"
              />
              <div className="product-overlay">
                <h3>{product.name}</h3>
                <p>{product.price}</p>
                <div className="color-options">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-circle ${
                        index === activeColorIndex ? "active" : ""
                      }`}
                      onClick={() => handleColorChange(product.id, index)}
                      style={{
                        backgroundImage: `url(${color.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
