import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../assets/styles/productPage.css";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth(); // ✅ Get user authentication state

  const { data: product, error } = useSWR(
    productId ? `/api/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  const initialColorIndex = location.state?.selectedColor
    ? product?.colors?.findIndex(
        (color) => color.imageUrl === location.state.selectedColor.imageUrl
      )
    : 0;

  const [selectedColorIndex, setSelectedColorIndex] = useState(initialColorIndex || 0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxLimitReached, setMaxLimitReached] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [animatingItems, setAnimatingItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState(new Set());

  const maxQuantity = 99;
  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  useEffect(() => {
    if (product && product.sizes?.length && !selectedSize) {
      setSelectedSize(product.sizes[0].size.size);
    }
  }, [product, selectedSize]);

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  const sortedSizes = product.sizes
    ? [...product.sizes].sort((a, b) => SIZE_ORDER.indexOf(a.size.size) - SIZE_ORDER.indexOf(b.size.size))
    : [];

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

  const handleWishlistToggle = () => {
  if (!user) {
    toast.error("You must log in to add items to your wishlist.");
    return;
  }

  const productKey = `${product.id}-${selectedSize}-${currentColor.imageUrl}`;

  if (animatingItems.includes(productKey)) {
    cancelWishlistMove();
  } else {
    toast.info(`${product.name} will be moved to your wishlist.`);

    setAnimatingItems((prev) => [...prev, productKey]);

    setCancelledItems((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.delete(productKey);
      return updatedSet;
    });

    const timer = setTimeout(() => {
      if (!cancelledItems.has(productKey)) {
        addToWishlist({
          id: product.id,
          name: product.name,
          price: product.price,
          selectedSize,
          selectedColor: currentColor.imageUrl,
        }).catch((error) => {
          if (error === "User not logged in") {
            toast.error("You must log in first to add items to your wishlist.");
          }
        });
      }

      setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
    }, 5000);

    product.timer = timer;
  }
};


  const cancelWishlistMove = () => {
    const productKey = `${product.id}-${selectedSize}-${currentColor.imageUrl}`;
    clearTimeout(product.timer);

    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));

    setCancelledItems((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(productKey);
      return updatedSet;
    });

    toast.info(`Cancelled moving ${product.name} to wishlist.`);
  };

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>

      <div className="product-container">
        {/* ✅ Wishlist Button (Top-Right of Product Card) */}
        <motion.img
  src={
    animatingItems.includes(`${product.id}-${selectedSize}-${currentColor.imageUrl}`) &&
    !cancelledItems.has(`${product.id}-${selectedSize}-${currentColor.imageUrl}`)
      ? "/wishlist-filled.png"
      : "/wishlist-outline.png"
  }
  alt="Wishlist"
  className="wishlist-icon-productPage"
  onClick={() =>
    animatingItems.includes(`${product.id}-${selectedSize}-${currentColor.imageUrl}`)
      ? cancelWishlistMove()
      : handleWishlistToggle()
  }
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
/>

        {/* Left side: images */}
        <div className="product-images">
          <div className="image-carousel">
            <button className="carousel-arrow left-arrow" onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}>❮</button>
            <img src={images[currentImageIndex]} alt={`${product.name} - ${currentColor.colorName || "default"}`} className="main-image" />
            <button className="carousel-arrow right-arrow" onClick={() => setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}>❯</button>
          </div>

          <div className="color-thumbnails">
            {product.colors?.map((color, index) => (
              <img key={index} src={color.imageUrl} alt={`${product.name} - ${color.colorName}`} className={`thumbnail ${selectedColorIndex === index ? "selected" : ""}`} onClick={() => { setSelectedColorIndex(index); setCurrentImageIndex(0); }} />
            ))}
          </div>
        </div>

        {/* Right side: details */}
        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-description">{product.description}</p>

          <div className="size-quantity-row">
            <div className="size-selector">
              {sortedSizes.map((productSize) => {
                const sizeString = productSize.size.size;
                return (
                  <button key={productSize.id} className={`size-button ${selectedSize === sizeString ? "selected" : ""}`} onClick={() => setSelectedSize(sizeString)}>
                    {sizeString}
                  </button>
                );
              })}
            </div>

            <div className="quantity-selector">
              <button className="quantity-button minus" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</button>
              <input type="number" min="1" max={maxQuantity} className="quantity-value" value={quantity} onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value, 10)), maxQuantity))} />
              <button className="quantity-button plus" onClick={() => setQuantity(Math.min(quantity + 1, maxQuantity))} disabled={quantity >= maxQuantity}>+</button>
            </div>
          </div>

          <button className="add-to-cart-button" onClick={handleAddToCart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
