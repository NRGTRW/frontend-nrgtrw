import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./CheckoutPage.css";
import { updateProfile } from "../../services/profileService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressTouched, setAddressTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // Compute grand total based on each item's price and quantity
  const totalPrice = cart.reduce((total, item) => {
    return total + (item.price ? item.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (!address.trim()) {
      setAddressTouched(true);
      toast.error("Please enter your delivery address.");
      return;
    }
    if (!phone.trim()) {
      setPhoneTouched(true);
      toast.error("Please enter your phone number.");
      return;
    }
    setLoading(true);
    try {
      // Update user profile if address or phone changed
      if ((user?.address !== address) || (user?.phone !== phone)) {
        const formData = new FormData();
        formData.append("address", address);
        formData.append("phone", phone);
        await updateProfile(formData);
      }
      // Use the authenticated user's ID if available; fallback to 1 for testing
      const userId = user?.id || 1;
      // Prepare the items array for the backend.
      const items = cart.map((item) => ({
        productId: item.productId || item.id,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        name: item.name,
      }));
      // Optionally update user profile with address/phone here (API call)
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
        <>
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
                </div>
              </li>
            ))}
          </ul>
          <div className="order-total">
            <strong>Grand Total: ${totalPrice.toFixed(2)}</strong>
          </div>
        </div>
        <div className="checkout-fields">
          <label className="checkout-label">
            Delivery Address <span style={{color: 'red'}}>*</span>
            <textarea
              className={`checkout-input${addressTouched && !address.trim() ? ' error' : ''}`}
              value={address}
              onChange={e => setAddress(e.target.value)}
              onBlur={() => setAddressTouched(true)}
              required
              rows={2}
              placeholder="Enter your delivery address"
            />
          </label>
          <label className="checkout-label">
            Phone Number <span style={{color: 'red'}}>*</span>
            <input
              className={`checkout-input${phoneTouched && !phone.trim() ? ' error' : ''}`}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onBlur={() => setPhoneTouched(true)}
              required
              type="tel"
              placeholder="Enter your phone number"
            />
          </label>
        </div>
        </>
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
