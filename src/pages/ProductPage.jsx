import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
const MAX_QUANTITY = 99;

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
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

  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  const sortedSizes = product?.sizes
    ? [...product.sizes].sort((a, b) => 
        SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
      )
    : [];

  useEffect(() => {
    if (sortedSizes.length && !selectedSize) {
      setSelectedSize(sortedSizes[0].size);
    }
  }, [sortedSizes, selectedSize]);

  const handleQuantityChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") value = 1;
    const newQuantity = Math.min(Math.max(Number(value), 1), MAX_QUANTITY);
    setQuantity(newQuantity);
    setMaxQuantityMessage(newQuantity >= MAX_QUANTITY);
  };

  const increaseQuantity = () => {
    quantity < MAX_QUANTITY 
      ? setQuantity(prev => prev + 1) 
      : setMaxQuantityMessage(true);
  };

  const decreaseQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
    setMaxQuantityMessage(false);
  };

  const handleAddToCart = () => {
    if (!product || !product.id || !product.name || !product.price) {
      toast.error("Error: Incomplete product data");
      return;
    }
  
    const selectedColor = product.colors?.[selectedColorIndex] || {};
    
    const missingFields = [];
    if (product.sizes?.length > 0 && !selectedSize) missingFields.push("size");
    if (!selectedColor.imageUrl) missingFields.push("color");
    
    if (missingFields.length > 0) {
      toast.error(`Missing required: ${missingFields.join(", ")}`);
      return;
    }
  
    const existingItem = cart.find(item => 
      item.productId === product.id &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor.imageUrl
    );
  
    const currentQuantity = existingItem?.quantity || 0;
    const newQuantity = Math.min(currentQuantity + quantity, MAX_QUANTITY);
    
    if (newQuantity <= currentQuantity) {
      toast.error(`Maximum quantity of ${MAX_QUANTITY} reached`);
      return;
    }
  
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      selectedSize: selectedSize,
      selectedColor: selectedColor.imageUrl, 
      quantity: quantity, 
      imageUrl: selectedColor.imageUrl 
    });
  
    toast.success(
      existingItem 
        ? `🛒 Added ${quantity} more (Total: ${newQuantity})`
        : `🛒 Added ${quantity} ${product.name} to cart!`
    );
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Login to use wishlist.");
      return;
    }

    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      selectedSize,
      selectedColor: currentColor.imageUrl,
    }).catch(() => toast.error(`Failed to add ${product.name} to wishlist.`));
  };

  const handleDeleteProduct = () => {
    if (window.confirm("This action is permanent. Do you want to delete this product?")) {
      // Proceed with deletion, API call for deletion should go here
      toast.success("Product deleted successfully.");
      navigate("/admin/products"); // Navigate to the manage products page after deletion
    }
  };

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>

      <div className="product-container">
        <motion.img
          src="/wishlist-outline.png"
          alt="Wishlist"
          className="wishlist-icon-productPage"
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        />

        <div className="product-images">
          {/* Delete button in the top-right corner of the image section */}
          {user && (user.role === "ADMIN" || user.role === "ROOT_ADMIN") && (
            <div 
              className="wishlist-button" 
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteProduct();
              }}
            >
              ❌
            </div>
          )}

          <div className="image-carousel">
            <button
              className="carousel-arrow left-arrow"
              onClick={() => setCurrentImageIndex(prev => 
                prev === 0 ? images.length - 1 : prev - 1
              )}
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
              onClick={() => setCurrentImageIndex(prev => 
                prev === images.length - 1 ? 0 : prev + 1
              )}
            >
              ❯
            </button>
          </div>

          <div className="color-thumbnails">
            {product.colors?.map((color, index) => (
              <img
                key={color.imageUrl}
                src={color.imageUrl}
                alt={`${product.name} - ${color.colorName}`}
                className={`thumbnail ${selectedColorIndex === index ? "selected" : ""}`}
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
              {sortedSizes.map(size => (
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
          </div>

          {maxQuantityMessage && <p className="max-quantity-message">Maximum quantity reached!</p>}

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={!selectedSize || !quantity}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
