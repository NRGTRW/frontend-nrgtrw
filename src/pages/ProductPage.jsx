import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import GoBackButton from "../components/GoBackButton";
import "../assets/styles/productPage.css";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();

  // Fetch product data by ID
  const { data: product, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  // Determine initial color index
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
  const [maxLimitReached, setMaxLimitReached] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Set maximum quantity to 999
  const maxQuantity = 999;

  // Current color object
  const currentColor = product?.colors?.[selectedColorIndex] || {};

  // Collect images for the carousel (main image + hover image)
  const images = [
    currentColor.imageUrl,
    currentColor.hoverImage,
  ].filter(Boolean); // Remove undefined/null values

  // Pick a default size once product is loaded
  useEffect(() => {
    if (product && product.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0].size.size);
    }
  }, [product, selectedSize]);

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  // Sort sizes in custom order
  const sortedSizes = product.sizes
    ? [...product.sizes].sort((a, b) =>
        SIZE_ORDER.indexOf(a.size.size) - SIZE_ORDER.indexOf(b.size.size)
      )
    : [];

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      selectedSize,
      selectedColor: currentColor.imageUrl,
    });
  };

  // Handle quantity changes by typing
  const handleQuantityInput = (e) => {
    const newVal = parseInt(e.target.value, 10);

    if (isNaN(newVal) || newVal < 1) {
      setQuantity(1);
      setMaxLimitReached(false);
    } else if (newVal > maxQuantity) {
      setQuantity(maxQuantity);
      setMaxLimitReached(true);
    } else {
      setQuantity(newVal);
      setMaxLimitReached(false);
    }
  };

  // Navigate images left
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Navigate images right
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>

      <div className="product-container">
        {/* Left side: images */}
        <div className="product-images">
          <div className="image-carousel">
            {/* Left arrow */}
            <button className="carousel-arrow left-arrow" onClick={prevImage}>
              ❮
            </button>

            {/* Main Image Display */}
            <img
              src={images[currentImageIndex]}
              alt={`${product.name} - ${currentColor.colorName || "default"}`}
              className="main-image"
            />

            {/* Right arrow */}
            <button className="carousel-arrow right-arrow" onClick={nextImage}>
              ❯
            </button>
          </div>

          {/* Color Selector Thumbnails */}
          <div className="color-thumbnails">
            {product.colors?.map((color, index) => (
              <img
                key={index}
                src={color.imageUrl}
                alt={`${product.name} - ${color.colorName}`}
                className={`thumbnail ${
                  selectedColorIndex === index ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedColorIndex(index);
                  setCurrentImageIndex(0); // Reset carousel when color is changed
                }}
              />
            ))}
          </div>
        </div>

        {/* Right side: details */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-quantity-row">
            {/* Size selector */}
            <div className="size-selector">
              {sortedSizes.map((productSize) => {
                const sizeString = productSize.size.size;
                return (
                  <button
                    key={productSize.id}
                    className={`size-button ${
                      selectedSize === sizeString ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(sizeString)}
                  >
                    {sizeString}
                  </button>
                );
              })}
            </div>

            {/* Quantity selector with max limit */}
            <div className="quantity-selector">
              <button
                className="quantity-button minus"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={maxQuantity}
                className="quantity-value"
                value={quantity}
                onChange={handleQuantityInput}
              />
              <button
                className="quantity-button plus"
                onClick={() => {
                  if (quantity < maxQuantity) {
                    setQuantity(quantity + 1);
                    setMaxLimitReached(false);
                  } else {
                    setMaxLimitReached(true);
                  }
                }}
                disabled={quantity >= maxQuantity}
              >
                +
              </button>
            </div>

            {/* Show message if user reaches max quantity */}
            {maxLimitReached && (
              <p className="max-limit-message">
                Maximum quantity reached. For bulk orders, please{" "}
                <a href="/contact">contact us</a>.
              </p>
            )}
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
