import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import GoBackButton from "../components/GoBackButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/cartPage.css";

const CartPage = () => {
  const { cart, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
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
      cancelWishlistMove(product);
    } else {
      toast.info(`${product.name} will be moved to your wishlist in 5 seconds.`);
      
      setAnimatingItems((prev) => [...prev, productKey]);
  
      // ✅ Remove from cancelledItems if reattempting
      setCancelledItems((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(productKey);
        return updatedSet;
      });
  
      const timer = setTimeout(() => {
        // ✅ Double-check if item is still in cancelledItems before adding
        if (!cancelledItems.has(productKey)) {
          addToWishlist(product)
            .then(() => {
              removeFromCart(product);
              toast.success(`${product.name} added to your wishlist and removed from your cart.`);
            })
            .catch(() => {
              toast.error(`Failed to add ${product.name} to your wishlist. Please try again.`);
            });
        }
  
        // ✅ Always remove from animatingItems after timeout
        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
      }, 5000);
  
      product.timer = timer;
    }
  };
  
  const cancelWishlistMove = (product) => {
    const productKey = `${product.id}-${product.selectedSize}-${product.selectedColor}`;
    clearTimeout(product.timer);
  
    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
  
    // ✅ Temporarily block this item but allow reattempts
    setCancelledItems((prev) => {
      const updatedSet = new Set(prev);
      updatedSet.add(productKey);
      return updatedSet;
    });
  
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
                        ? "/wishlist-filled.png"
                        : "/wishlist-outline.png"
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
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
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
