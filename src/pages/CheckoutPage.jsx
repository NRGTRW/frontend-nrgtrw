import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const CheckoutPage = () => {
  const { cart, getTotalPrice } = useCart();
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleCheckout = async () => {
    try {
      if (!profile?.address || !profile?.phone) {
        return alert("Please complete your profile before checking out.");
      }

      const items = cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      await axios.post(
        "/orders",
        { items },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Order placed successfully!");
      navigate("/orders"); // Redirect to orders page
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="cart-summary">
        {cart.map((item) => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </div>
        ))}
      </div>
      <h2>Total: ${getTotalPrice()}</h2>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
};

export default CheckoutPage;
