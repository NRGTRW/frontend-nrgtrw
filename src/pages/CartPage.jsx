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
    if (!product.cartItemId) {
      console.error("❌ Missing cartItemId for product:", product);
      toast.error("Error: Unable to remove item.");
      return;
    }

    removeFromCart(product.cartItemId); // ✅ Ensure `cartItemId` is used
    // toast.success(`Item removed from your cart.`);
    // ${product.name}
  };

  const handleWishlistToggle = (product) => {
    const productKey = `${product.cartItemId}-${product.selectedSize}-${product.selectedColor}`;

    if (animatingItems.includes(productKey)) {
      cancelWishlistMove(product);
    } else {
      toast.info(`Item will be moved to your wishlist.`);
      setAnimatingItems((prev) => [...prev, productKey]);

      // ✅ Remove from cancelledItems if reattempting
      setCancelledItems((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.delete(productKey);
        return updatedSet;
      });

      const timer = setTimeout(() => {
        if (!cancelledItems.has(productKey)) {
          addToWishlist({
            id: product.productId, // ✅ Use productId, not cartItemId
            name: product.name,
            price: product.price,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
          })
            .then(() => {
              removeFromCart(product.cartItemId); // ✅ Remove using cartItemId
            })
            .catch(() => {
              toast.error(
                `Failed to add ${product.name} to your wishlist. Please try again.`
              );
            });
        }
        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
      }, 5000);

      product.timer = timer;
    }
  };

  const cancelWishlistMove = (product) => {
    const productKey = `${product.cartItemId}-${product.selectedSize}-${product.selectedColor}`;
    clearTimeout(product.timer);

    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));

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
          {cart.map((product, index) => {
            if (!product.cartItemId) {  // ✅ Ensure we're checking `cartItemId`
              console.error("❌ Missing cartItemId in cart item:", product);
              return null; // Prevent rendering items with missing IDs
            }

            const productKey = `${product.cartItemId}-${index}`; // ✅ Use cartItemId

            return (
              <motion.div key={productKey} className="cart-item">
                <img
                  src={product.selectedColor}
                  alt={product.name}
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
                <div className="cart-item-details">
                  <h3>{product.name}</h3>
                  <p>Size: {product.selectedSize}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Price: ${product.price}</p>
                </div>
                <div className="cart-item-actions">
                  {/* ✅ Wishlist Button - Now Correctly Implemented */}
                  <motion.img
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
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
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
