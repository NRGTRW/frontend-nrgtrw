import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "./cartPage.css";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [animatingItems, setAnimatingItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState(new Set());
  const timersRef = useRef({}); 

  // 🚀 Optimistic removal of cart items
  const handleRemove = (product) => {
    if (!product.cartItemId || !product.name) {
      toast.error(
        `🗑️ Unable to remove  ${product.name}! Please try again later.`,
      );
      return;
    }

    toast.promise(removeFromCart(product.cartItemId), {
      pending: `Removing ${product.name}...`,
      success: `${product.name}(s) removed from your cart!`,
      error: `Failed to remove ${product.name} from cart.`,
    });
  };

  // ❤️ Wishlist toggle with animation delay
  const handleWishlistToggle = (product) => {
    if (!product.name) {
      toast.error(`Error: Unable to add ${product.name} to wishlist.`);
      return;
    }

    const productKey = `${product.productId}-${product.selectedSize}-${product.selectedColor}`;

    if (animatingItems.includes(productKey)) {
      cancelWishlistMove(productKey);
    } else {
      toast.info(`${product.name} will be moved to your wishlist.`);
      setAnimatingItems((prev) => [...prev, productKey]);

      const timer = setTimeout(() => {
        if (!cancelledItems.has(productKey)) {
          addToWishlist({
            id: product.productId,
            name: product.name,
            price: product.price,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
          })
            .then(() => removeFromCart(product.cartItemId))
            .catch(() => {
              toast.error(
                `Failed to add ${product.name} to wishlist. Please try again.`,
              );
            });
        }

        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
        delete timersRef.current[productKey]; // Cleanup timer reference
      }, 2500);

      timersRef.current[productKey] = timer;
    }
  };

  // ❌ Cancel wishlist move
  const cancelWishlistMove = (productKey, product) => {
    if (timersRef.current[productKey]) {
      clearTimeout(timersRef.current[productKey]);
      delete timersRef.current[productKey];
    }
    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
    setCancelledItems((prev) => new Set([...prev, productKey]));
    toast.info(
      `❌ Wishlist update canceled! The ${product.name} remains in your cart.`,
    );
  };

  // 🔄 Cleanup timers when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  // 🛒 Calculate total price
  const calculateTotal = () =>
    cart.reduce(
      (total, product) => total + product.quantity * product.price,
      0,
    );

  if (!cart.length) {
    return (
      <div className="cart-page empty">
        <h2>
          Your cart is currently empty. Explore our catalog and add products you
          love!
        </h2>
        <GoBackButton text="Return to Previous Page" />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        <AnimatePresence>
          {cart.map((product) => {
            if (!product.cartItemId || !product.name) {
              console.error(
                "❌ Missing cartItemId or name in cart item:",
                product,
              );
              return null;
            }

            const productKey = `${product.productId}-${product.selectedSize}-${product.selectedColor}`;
            const isAnimating =
              animatingItems.includes(productKey) &&
              !cancelledItems.has(productKey);

            return (
              <motion.div
                key={product.cartItemId}
                className={`cart-item ${isAnimating ? "blurred" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
                <div className="cart-item-details">
                  <h3>{product.name || "Unnamed Product"}</h3>
                  <p>Size: {product.selectedSize}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${Number(product.price).toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <motion.img
                    src={
                      isAnimating
                        ? "/wishlist-filled.png"
                        : "/wishlist-outline.png"
                    }
                    alt="Wishlist"
                    className={`wishlist-icon ${isAnimating ? "wishlisted" : ""}`}
                    onClick={() => handleWishlistToggle(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <motion.button
                    className="remove-item-button"
                    onClick={() => handleRemove(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Remove
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <h3>Total: ${calculateTotal().toFixed(2)}</h3>

      <div className="cart-actions">
        <motion.button
          className="continue-shopping-button"
          onClick={() => navigate("/clothing")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Shopping
        </motion.button>
        <motion.button
          className="checkout-button"
          onClick={() => navigate("/checkout")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Checkout
        </motion.button>
      </div>

      <GoBackButton />
    </div>
  );
};

export default CartPage;
