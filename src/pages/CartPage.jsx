import React from "react";
import { useCart } from "../context/CartContext";
import GoBackButton from "../components/GoBackButton";
import "../assets/styles/cartPage.css";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, moveToWishlist } = useCart();

  const handleRemove = (product) => {
    removeFromCart(product);
  };

  const navigate = useNavigate();

  const handleMoveToWishlist = (product) => {
    moveToWishlist(product);
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
        {cart.map((product) => (
          <div
            key={`${product.id}-${product.selectedSize}-${product.selectedColor}`}
            className="cart-item"
          >
            <img
              src={product.selectedColor}
              alt={product.name}
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3>{product.name}</h3>
              <p>Size: {product.selectedSize}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Price: ${product.price}</p>
            </div>
            <button
              className="remove-item-button"
              onClick={() => handleRemove(product)}
            >
              Remove
            </button>
            <button
              className="wishlist-button"
              onClick={() => handleMoveToWishlist(product)}
            >
              Move to Wishlist
            </button>
          </div>
        ))}
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
            onClick={() => alert("Proceeding to checkout...")}
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
