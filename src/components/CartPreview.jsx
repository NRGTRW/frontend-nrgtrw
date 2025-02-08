import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../assets/styles/cartPreview.css";

const CartPreview = () => {
  const { cart, getTotalQuantity } = useCart();
  const navigate = useNavigate();

  // Determine if the cart has items either by cart array or by total quantity
  const hasItems = cart && cart.length > 0;

  return (
    <div className="cart-preview">
      <h4>Cart Summary</h4>
      {hasItems ? (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.cartItemId} className="cart-preview-item">
                <img
                  src={item.imageUrl} // Product image
                  alt={item.name}
                  className="cart-preview-item-image"
                  onClick={() => navigate(`/product/${item.productId}`)} // Navigate to product detail
                />
                <div className="cart-preview-item-info">
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-qty">{item.quantity}x</span>
                  <span className="cart-item-size">
                    Size: {item.selectedSize}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>Your cart is empty.</p>
      )}
      <button className="view-cart-button" onClick={() => navigate("/cart")}>
        View Cart
      </button>
    </div>
  );
};

export default CartPreview;
