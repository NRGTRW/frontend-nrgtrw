import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "../assets/styles/productPage.css";

import {
  eleganceProducts,
  pumpCoversProducts,
  confidenceProducts,
} from "../data/products";

const allProducts = [
  ...eleganceProducts,
  ...pumpCoversProducts,
  ...confidenceProducts,
];

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0); // Manage selected color
  const [isHoverImage, setIsHoverImage] = useState(false); // Toggle between primary and hover images
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchedProduct = allProducts.find(
      (item) => item.id === parseInt(productId)
    );
    if (fetchedProduct) {
      setProduct(fetchedProduct);

      // Use activeColorIndex from state or default to the first color
      const activeColorIndex = location.state?.activeColorIndex || 0;
      setSelectedColorIndex(activeColorIndex);

      setSelectedSize(fetchedProduct.sizes ? fetchedProduct.sizes[0] : "One Size");
    }
  }, [productId, location.state]);

  const handleImageToggle = () => {
    // Toggle between the primary image and the hover image
    setIsHoverImage(!isHoverImage);
  };

  const handleColorSelection = (index) => {
    setSelectedColorIndex(index);
    setIsHoverImage(false); // Reset to primary image when switching colors
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    alert(
      `${quantity} ${product?.name}(s) of size ${selectedSize} added to your cart!`
    );
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const currentColor = product.colors[selectedColorIndex];
  const imageToShow = isHoverImage
    ? currentColor.hoverImage
    : currentColor.image; // Decide whether to show hover or primary image

  return (
    <div className="product-page">
      <div className="spacer-bar2"></div>
      <div className="product-container">
        {/* Product Images */}
        <div className="product-images">
          <div className="image-carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={handleImageToggle} // Toggle between primary and hover image
            >
              &#8249;
            </button>
            <img
              src={imageToShow}
              alt={product.name}
              className="main-image"
            />
            <button
              className="carousel-arrow right-arrow"
              onClick={handleImageToggle} // Toggle between primary and hover image
            >
              &#8250;
            </button>
          </div>
          <div className="image-thumbnails">
            {product.colors?.map((color, index) => (
              <img
                key={index}
                src={color.image}
                alt={`Color Option ${index + 1}`}
                className={`thumbnail ${
                  selectedColorIndex === index ? "active" : ""
                }`}
                onClick={() => handleColorSelection(index)} // Change color on click
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-description">{product.description}</p>

          {/* Size Selector */}
          <div className="size-selector">
            {product.sizes?.length > 0 ? (
              product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </button>
              ))
            ) : (
              <p>No sizes available</p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="quantity-wrapper">
            <button
              className="quantity-arrow"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              &#8722;
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, e.target.value))}
              min="1"
            />
            <button
              className="quantity-arrow"
              onClick={() => setQuantity(quantity + 1)}
            >
              &#43;
            </button>
          </div>

          {/* Add to Cart Button */}
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
