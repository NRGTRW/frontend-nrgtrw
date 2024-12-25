import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/cartPage.css";

const CartPage = () => {
  // Sample cart items; replace this with context or state management later
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Product 1",
      size: "M",
      color: "Red",
      quantity: 2,
      price: 50,
      image: "/path/to/image1.jpg",
    },
    {
      id: 2,
      name: "Product 2",
      size: "L",
      color: "Blue",
      quantity: 1,
      price: 75,
      image: "/path/to/image2.jpg",
    },
  ]);

  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Your Cart is Empty</h2>
        <button onClick={() => navigate("/clothing")}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p>Size: {item.size}</p>
              <p>Color: {item.color}</p>
              <p>Price: ${item.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              className="remove-item-button"
              onClick={() => handleRemoveItem(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Total: ${calculateTotal()}</h3>
        <button className="checkout-button" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
