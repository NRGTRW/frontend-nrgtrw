import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../assets/styles/CheckoutPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cart, getTotalQuantity } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Compute grand total based on each item's price and quantity
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price ? item.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setLoading(true);
    try {
      // Use the authenticated user's ID if available; fallback to 1 for testing
      const userId = user?.id || 1;
      // Prepare the items array for the backend. (Adjust if your API expects additional data.)
      const items = cart.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
      }));

      const data = await createCheckoutSession({ userId, items });
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (error) {
        console.error("Stripe redirect error:", error);
        toast.error("Failed to redirect to payment.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Checkout failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-heading">Checkout</h1>
      {cart.length === 0 ? (
        <p className="empty-message">Your cart is empty.</p>
      ) : (
        <div className="order-summary">
          <h2 className="order-heading">Order Summary</h2>
          <ul className="order-list">
            {cart.map((item, index) => (
              <li key={index} className="order-item">
                <div className="item-image-container">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                </div>
                <div className="item-details">
                  <p className="item-name">
                    <strong>{item.name || "Unnamed Product"}</strong>
                  </p>
                  <p className="item-quantity">Quantity: {item.quantity}</p>
                  <p className="item-price">
                    Price: ${item.price ? item.price.toFixed(2) : "0.00"}
                  </p>
                  <p className="item-total">
                    Subtotal: $
                    {item.price
                      ? (item.price * item.quantity).toFixed(2)
                      : "0.00"}
                  </p>
                  {/* {item.selectedColor && (
                    <div className="color-swatch">
                      <span>Color:</span>
                      <div
                        className="color-box"
                        style={{ backgroundColor: item.selectedColor }}
                      ></div>
                    </div>
                  )} */}
                </div>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Grand Total: ${totalPrice.toFixed(2)}</strong>
          </div>
        </div>
      )}
      <button
        onClick={handleCheckout}
        disabled={loading || cart.length === 0}
        className="checkout-button"
      >
        {loading ? "Processing..." : "Pay with Stripe"}
      </button>
    </div>
  );
};

export default CheckoutPage;
