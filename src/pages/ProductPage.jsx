import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/productPage.css";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_QUANTITY = 99;

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();

  const { data: product, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  const initialColorIndex = product?.colors
    ? product.colors.findIndex(
        (color) => color.imageUrl === location.state?.selectedColor?.imageUrl
      )
    : 0;

  const [selectedColorIndex, setSelectedColorIndex] = useState(
    initialColorIndex !== -1 ? initialColorIndex : 0
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxQuantityMessage, setMaxQuantityMessage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timersRef = useRef({});

  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  // 📌 Debugging: Log fetched product data
  useEffect(() => {
    if (product) {
      console.log("📌 Product Data in Frontend:", product);
    }
  }, [product]);

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  // ✅ Extract and sort sizes correctly
  const sortedSizes = product?.productsize?.map((ps) => ps.size.size) || [];
  sortedSizes.sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));

  // ✅ Set an initial size when product loads
  useEffect(() => {
    if (sortedSizes.length && !selectedSize) {
      setSelectedSize(sortedSizes[0]);
    }
  }, [sortedSizes, selectedSize]);

  // --- Quantity Handling ---
  const handleQuantityChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") value = 1;
    const newQuantity = Math.min(Math.max(Number(value), 1), MAX_QUANTITY);
    setQuantity(newQuantity);
    setMaxQuantityMessage(newQuantity >= MAX_QUANTITY);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, MAX_QUANTITY));
    setMaxQuantityMessage(quantity >= MAX_QUANTITY);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
    setMaxQuantityMessage(false);
  };

  // --- Add to Cart ---
  const handleAddToCart = () => {
    if (!product || !product.id || !product.name || !product.price) {
      toast.error("Error: Cannot add item to cart.");
      return;
    }
    if (sortedSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }
    const finalColor = currentColor?.imageUrl || "default-color";

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedSize,
      selectedColor: finalColor,
      quantity,
    });

    toast.success(`Added ${quantity} ${product.name}(s) to your cart.`);
  };

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>

      <div className="product-container">
        {/* Wishlist Icon */}
        <motion.img
          src="/wishlist-outline.png"
          alt="Wishlist"
          className="wishlist-icon-productPage"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toast.info("Wishlist feature coming soon!")}
        />

        {/* Product Images Section */}
        <div className="product-images">
          <div className="image-carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
            >
              ❮
            </button>
            <img
              src={images[currentImageIndex] || product.imageUrl}
              alt={`${product.name} - ${currentColor.colorName || "default"}`}
              className="main-image"
            />
            <button
              className="carousel-arrow right-arrow"
              onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
            >
              ❯
            </button>
          </div>

          <div className="color-thumbnails">
            {product.colors?.map((color, index) => (
              <img
                key={index}
                src={color.imageUrl}
                alt={`${product.name} - ${color.colorName}`}
                className={`thumbnail ${selectedColorIndex === index ? "selected" : ""}`}
                onClick={() => setSelectedColorIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-quantity-row">
            {/* ✅ Size Selector */}
            <div className="size-selector">
              {sortedSizes.length > 0 ? (
                sortedSizes.map((size, index) => (
                  <button
                    key={index}
                    className={`size-button ${selectedSize === size ? "selected" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <p className="size-warning">Sizes not available</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <button className="quantity-button minus" onClick={decreaseQuantity} disabled={quantity <= 1}>
                -
              </button>
              <input type="text" className="quantity-input" value={quantity} onChange={handleQuantityChange} />
              <button className="quantity-button plus" onClick={increaseQuantity} disabled={quantity >= MAX_QUANTITY}>
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
