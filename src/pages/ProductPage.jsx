import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import GoBackButton from "../components/GoBackButton";
import "../assets/styles/productPage.css";
// TOAST(S)

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  const { data: product, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  // Extract initial selected color from state if available
  const initialColorIndex = location.state?.selectedColor
    ? product?.colors?.findIndex(
        (color) => color.imageUrl === location.state.selectedColor.imageUrl
      )
    : 0;

  const [selectedColorIndex, setSelectedColorIndex] = useState(
    initialColorIndex || 0
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const currentColor = product?.colors?.[selectedColorIndex] || {};

  useEffect(() => {
    if (product && !selectedSize) {
      setSelectedSize(product.sizes[0]?.size);
    }
  }, [product]);

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      selectedSize,
      selectedColor: currentColor.imageUrl, // Updated to use `currentColor.imageUrl`
      quantity,
      price: product.price,
    });
  };

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>
      <div className="product-container">
        <div className="product-images">
          <div className="image-carousel">
            <img
              src={currentColor.imageUrl || product.imageUrl}
              alt={`${product.name} - ${currentColor.colorName || "default"}`}
              className="main-image"
            />
          </div>
          <div className="image-thumbnails">
            {product.colors?.map((color, index) => (
              <img
                key={index}
                src={color.imageUrl}
                alt={`${product.name} - ${color.colorName}`}
                className={`thumbnail ${
                  selectedColorIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedColorIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-quantity-row">
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button
                  key={size.id}
                  className={`size-button ${
                    selectedSize === size.size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
            <div className="quantity-selector">
              <button
                className="quantity-button minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-button plus"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
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
