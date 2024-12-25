/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isHoverImage, setIsHoverImage] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchedProduct = allProducts.find(
      (item) => item.id === parseInt(productId)
    );
    if (fetchedProduct) {
      setProduct(fetchedProduct);

      const activeColorIndex = location.state?.activeColorIndex || 0;
      setSelectedColorIndex(activeColorIndex);

      setSelectedSize(fetchedProduct.sizes ? fetchedProduct.sizes[0] : "One Size");
    }
  }, [productId, location.state]);

  const handleImageToggle = () => {
    setIsHoverImage(!isHoverImage);
  };

  const handleColorSelection = (index) => {
    setSelectedColorIndex(index);
    setIsHoverImage(false);
  };

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    alert(
      `${quantity} ${product?.name}(s) of size ${selectedSize} added to your cart!`
    );
  };

  const handleGoBack = () => {
    navigate("/clothing");
  };

  const QuantitySelector = ({ min = 1, max = 99, initialQuantity = 1 }) => {
    const [inputValue, setInputValue] = useState(initialQuantity.toString());
    const [typingTimeout, setTypingTimeout] = useState(null);

    const increment = () => {
      const newQuantity = Math.min(max, quantity + 1);
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
      clearTimeout(typingTimeout);
    };

    const decrement = () => {
      const newQuantity = Math.max(min, quantity - 1);
      setQuantity(newQuantity);
      setInputValue(newQuantity.toString());
      clearTimeout(typingTimeout);
    };

    const handleInputChange = (e) => {
      const value = e.target.value.replace(/\D/g, ""); // Allow only digits
      setInputValue(value);

      clearTimeout(typingTimeout);
      const timeout = setTimeout(() => {
        const parsedValue = Math.max(min, Math.min(max, parseInt(value) || min));
        setQuantity(parsedValue);
        setInputValue(parsedValue.toString());
      }, 5000); // 5-second delay
      setTypingTimeout(timeout);
    };

    return (
      <div className="quantity-selector">
        <button
          className={`quantity-button minus ${quantity === min ? "disabled" : ""}`}
          onClick={decrement}
          disabled={quantity === min}
        >
          &#8722;
        </button>
        <input
          type="text"
          className="quantity-input"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button
          className={`quantity-button plus ${quantity === max ? "disabled" : ""}`}
          onClick={increment}
          disabled={quantity === max}
        >
          &#43;
        </button>
      </div>
    );
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  const currentColor = product.colors[selectedColorIndex];
  const imageToShow = isHoverImage
    ? currentColor.hoverImage
    : currentColor.image;

  return (
    <div className="product-page">
      <button className="go-back-button" onClick={handleGoBack}>
        Back
      </button>

      <div className="spacer-bar2"></div>
      <div className="product-container">
        <div className="product-images">
          <div className="image-carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={handleImageToggle}
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
              onClick={handleImageToggle}
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
                onClick={() => handleColorSelection(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">{product.price}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-quantity-row">
            <div className="size-selector">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => handleSizeSelection(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Quantity Selector */}
            <QuantitySelector initialQuantity={quantity} />
          </div>

          <button className="add-to-cart-button" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
