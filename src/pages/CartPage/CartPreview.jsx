import React from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./cartPreview.css";

const CartPreview = () => {
  const cartContext = useCart();
  const cart = cartContext?.cart || [];
  const getTotalQuantity = cartContext?.getTotalQuantity || (() => 0);
  const navigate = useNavigate();


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
                  src={item.imageUrl}
                  alt={item.name}
                  className="cart-preview-item-image"
                  onClick={() => navigate(`/product/${item.productId}`)}
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
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p style={{ color: 'var(--text-secondary, #666)', margin: '0 0 16px' }}>
            Your cart is empty.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary, #888)' }}>
            Add some items to get started!
          </p>
        </div>
      )}
      <button className="view-cart-button" onClick={() => navigate("/cart")}>
        View Cart
      </button>
    </div>
  );
};

export default CartPreview;
