import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { createCheckoutSession } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import "./FitnessCheckoutPage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const FitnessCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

  useEffect(() => {
    if (!location.state) {
      toast.error("No checkout data found. Please try again.");
      navigate("/fitness");
      return;
    }

    if (!user) {
      toast.error("Please log in to continue with checkout.");
      navigate("/login", { 
        state: { 
          redirectTo: location.pathname,
          message: "Please log in to continue with checkout"
        }
      });
      return;
    }

    setCheckoutData(location.state);
  }, [location.state, user, navigate, location.pathname]);

  const handleCheckout = async () => {
    if (!checkoutData || !user) {
      toast.error("Checkout data or user not found.");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;
      
      let checkoutPayload;
      
      if (checkoutData.type === "fitness_one_time") {
        // Single program purchase
        checkoutPayload = {
          userId: user.id,
          type: "fitness_one_time",
          items: [checkoutData.program]
        };
      } else if (checkoutData.type === "fitness_subscription") {
        // Subscription purchase
        checkoutPayload = {
          userId: user.id,
          type: "fitness_subscription",
          subscription: checkoutData.subscription
        };
      } else {
        throw new Error("Invalid checkout type");
      }

      const data = await createCheckoutSession(checkoutPayload);
      
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

  if (!checkoutData) {
    return (
      <div className="fitness-checkout-container">
        <div className="loading-message">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="fitness-checkout-container">
      <h1 className="checkout-heading">Fitness Checkout</h1>
      
      {checkoutData.type === "fitness_one_time" ? (
        <div className="order-summary">
          <div className="program-item">
            <div className="program-details">
              <h3 className="program-name">{checkoutData.program.name}</h3>
              <p className="program-price">${checkoutData.program.price.toFixed(2)}</p>
              <p className="program-description">{checkoutData.program.description}</p>
            </div>
            <div className="program-image-container">
              <img
                src={checkoutData.program.image}
                alt={checkoutData.program.name}
                className="program-image"
              />
            </div>
          </div>
          {/* <div className="order-total">
            <strong>Total: ${checkoutData.program.price.toFixed(2)}</strong>
          </div> */}
        </div>
      ) : (
        <div className="order-summary">
          <div className="subscription-item">
            <div className="subscription-details">
              <h3 className="subscription-name">{checkoutData.subscription.name}</h3>
              <p className="subscription-price">${checkoutData.subscription.price.toFixed(2)} per {checkoutData.subscription.interval}</p>
              <p className="subscription-description">{checkoutData.subscription.description}</p>
            </div>
            <div className="subscription-icon">⭐</div>
          </div>
          <div className="order-total">
            <strong>Monthly: ${checkoutData.subscription.price.toFixed(2)}</strong>
          </div>
        </div>
      )}

      <div className="checkout-actions">
        <button
          onClick={() => navigate("/fitness")}
          className="back-button"
          disabled={loading}
        >
          Back to Programs
        </button>
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="checkout-button"
        >
          {loading ? "Processing..." : "Pay with Stripe"}
        </button>
      </div>
    </div>
  );
};

export default FitnessCheckoutPage; 