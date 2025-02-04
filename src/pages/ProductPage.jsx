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
const MAX_QUANTITY = 99; // Maximum allowed quantity

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  // Destructure both addToCart and cart so we can check for existing items.
  const { addToCart, cart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();

  const { data: product, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  // Determine initial color based on location state (if any)
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
  const [animatingItems, setAnimatingItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const timersRef = useRef({});

  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  // --- Use the correct key "sizes" from the API ---
  // Compute sorted sizes using the "sizes" relation from the API response.
  const sortedSizes = product?.sizes
    ? [...product.sizes]
        .map((ps) => ps.size)
        .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size))
    : [];

  // Debug log to check if sizes are coming through
  useEffect(() => {
    console.log("Sorted sizes:", sortedSizes);
  }, [sortedSizes]);

  // Set an initial size if not already selected using sortedSizes
  useEffect(() => {
    if (sortedSizes.length && !selectedSize) {
      setSelectedSize(sortedSizes[0].size);
    }
  }, [sortedSizes, selectedSize]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (product) {
      console.log("📌 Product Data in Frontend:", product);
    }
  }, [product]);

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  // --- Quantity Handling ---
  const handleQuantityChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    if (value === "") value = 1;
    const newQuantity = Math.min(Math.max(Number(value), 1), MAX_QUANTITY);
    setQuantity(newQuantity);
    // Show bulk popup if at max
    if (newQuantity >= MAX_QUANTITY) setMaxQuantityMessage(true);
    else setMaxQuantityMessage(false);
  };

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY) {
      setQuantity((prev) => prev + 1);
      setMaxQuantityMessage(false);
    } else {
      setMaxQuantityMessage(true);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
    setMaxQuantityMessage(false);
  };

  // --- Add to Cart (Merging Quantities) ---
  const handleAddToCart = () => {
    if (!product || !product.id || !product.name || !product.price) {
      toast.error("Error: Cannot add item to cart.");
      return;
    }

    // Ensure a size is selected if required
    if (product?.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size before adding to cart.");
      return;
    }

    // Ensure selected color is not null
    const finalColor = currentColor?.imageUrl || "default-color";

    // Check if this item is already in the cart (matching product, size, and color)
    const existingItem = cart.find(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === finalColor
    );
    // If it exists, sum the new quantity with the existing quantity; otherwise use the chosen quantity.
    const mergedQuantity = existingItem ? existingItem.quantity + quantity : quantity;

    // Send request to backend (it will handle quantity updates)
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedSize,
      selectedColor: finalColor,
      quantity: mergedQuantity,
    });

    toast.success(`Added ${quantity} ${product.name}(s) to your cart.`);
  };

  // --- Wishlist Functionality ---
  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("You must log in to add items to your wishlist.");
      return;
    }

    const productKey = `${product.id}-${selectedSize}-${currentColor.imageUrl}`;

    if (animatingItems.includes(productKey)) {
      cancelWishlistMove(productKey);
    } else {
      toast.info(`${product.name} will be moved to your wishlist.`);
      setAnimatingItems((prev) => [...prev, productKey]);

      const timer = setTimeout(() => {
        if (!cancelledItems.has(productKey)) {
          addToWishlist({
            id: product.id,
            name: product.name,
            price: product.price,
            selectedSize,
            selectedColor: currentColor.imageUrl,
          }).catch(() => {
            toast.error("Failed to add item to wishlist.");
          });
        }
        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
        delete timersRef.current[productKey];
      }, 3000);

      timersRef.current[productKey] = timer;
    }
  };

  const cancelWishlistMove = (productKey) => {
    if (timersRef.current[productKey]) {
      clearTimeout(timersRef.current[productKey]);
      delete timersRef.current[productKey];
    }
    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
    setCancelledItems((prev) => new Set([...prev, productKey]));
    toast.info("Cancelled moving item to wishlist.");
  };

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>

      <div className="product-container">
        {/* Wishlist Icon – retains its functionality */}
        <motion.img
          src={
            animatingItems.includes(`${product.id}-${selectedSize}-${currentColor.imageUrl}`) &&
            !cancelledItems.has(`${product.id}-${selectedSize}-${currentColor.imageUrl}`)
              ? "/wishlist-filled.png"
              : "/wishlist-outline.png"
          }
          alt="Wishlist"
          className="wishlist-icon-productPage"
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        {/* Product Images Section */}
        <div className="product-images">
          <div className="image-carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
              }
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
              onClick={() =>
                setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
              }
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
            <div className="size-selector">
              {sortedSizes.map((size) => (
                <button
                  key={size.id}
                  className={`size-button ${selectedSize === size.size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size.size)}
                >
                  {size.size}
                </button>
              ))}
            </div>

            <div className="quantity-selector">
              <button
                className="quantity-button minus"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="text"
                className="quantity-input"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button
                className="quantity-button plus"
                onClick={increaseQuantity}
                disabled={quantity >= MAX_QUANTITY}
              >
                +
              </button>
            </div>

            {/* Bulk Order Popup – appears below quantity selector */}
            <AnimatePresence>
              {maxQuantityMessage && (
                <motion.div
                  className="max-quantity-popup"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  Max quantity reached. <Link to="/contact-us">Contact us</Link> for bulk orders.
                </motion.div>
              )}
            </AnimatePresence>
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
