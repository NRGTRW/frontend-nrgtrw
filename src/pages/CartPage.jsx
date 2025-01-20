import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import GoBackButton from "../components/GoBackButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/cartPage.css";

const CartPage = () => {
  const { cart, removeFromCart, moveToWishlist } = useCart();
  const navigate = useNavigate();
  const [animatingItems, setAnimatingItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState(new Set());

  const handleRemove = (product) => {
    removeFromCart(product);
    toast.success(`${product.name} removed from your cart.`);
  };

  const handleWishlistToggle = (product) => {
    const productKey = `${product.id}-${product.selectedSize}-${product.selectedColor}`;

    if (animatingItems.includes(productKey)) {
      cancelWishlistMove(product); // Cancel the move
    } else {
      toast.info(`${product.name} will be moved to your wishlist in 5 seconds.`);
      setAnimatingItems((prev) => [...prev, productKey]);

      const timer = setTimeout(() => {
        if (!cancelledItems.has(productKey)) {
          moveToWishlist(product);
          toast.success(`${product.name} added to your wishlist.`);
        }
        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
      }, 5000);

      // Store the timer reference for potential cancellation
      product.timer = timer;
    }
  };

  const cancelWishlistMove = (product) => {
    const productKey = `${product.id}-${product.selectedSize}-${product.selectedColor}`;
    clearTimeout(product.timer); // Clear the timer
    setAnimatingItems((prev) => prev.filter((key) => key !== productKey)); // Remove from animating
    setCancelledItems((prev) => new Set([...prev, productKey])); // Mark as cancelled
    toast.info(`Cancelled moving ${product.name} to wishlist.`);
  };

  const calculateTotal = () =>
    cart.reduce((total, product) => total + product.quantity * product.price, 0);

  if (!cart.length) {
    return (
      <div className="cart-page empty">
        <div className="spacer-bar"></div>
        <h2>Your cart is currently empty. Explore our catalog and add products you love!</h2>
        <GoBackButton text="Return to Previous Page" />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="spacer-bar"></div>
      <h2>Your Cart</h2>
      <div className="cart-items">
        <AnimatePresence>
          {cart.map((product) => {
            const productKey = `${product.id}-${product.selectedSize}-${product.selectedColor}`;
            return (
              <motion.div
                key={productKey}
                className="cart-item"
                initial={{ opacity: 1, x: 0 }}
                animate={{
                  opacity: animatingItems.includes(productKey) ? 0.5 : 1,
                }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={product.selectedColor}
                  alt={product.name}
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${product.id}`)}
                />
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p>Size: {product.selectedSize}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="cart-item-actions">
                  <img
                    src={
                      animatingItems.includes(productKey) &&
                      !cancelledItems.has(productKey)
                        ? "/wishlist-outline.png"
                        : "/wishlist-filled.png"
                    }
                    alt="Wishlist"
                    className="wishlist-icon"
                    onClick={() =>
                      animatingItems.includes(productKey)
                        ? cancelWishlistMove(product)
                        : handleWishlistToggle(product)
                    }
                  />
                  <button
                    className="remove-item-button"
                    onClick={() => handleRemove(product)}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <div className="cart-summary">
        <h3>Total: ${calculateTotal()}</h3>
        <div className="button-group">
          <button
            className="continue-shopping-button"
            onClick={() => navigate("/clothing")}
          >
            Continue Shopping
          </button>
          <button
            className="checkout-button"
            onClick={() => toast.info("Proceeding to checkout...")}
          >
            Proceed to Checkout
          </button>
        </div>
        <GoBackButton />
      </div>
    </div>
  );
};

export default CartPage;
