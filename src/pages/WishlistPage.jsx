import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import GoBackButton from "../components/GoBackButton";
import "../assets/styles/wishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page empty">
        <h2>Your Wishlist is Empty</h2>
        <GoBackButton text="Return to Shopping" />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <h2>Your Wishlist</h2>
      <div className="wishlist-items">
        {wishlist.map((product) => (
          <div key={product.id} className="wishlist-item">
            <img
              src={product.selectedColor}
              alt={product.name}
              className="wishlist-item-image"
              onClick={() => navigate(`/product/${product.id}`)}
            />
            <div className="wishlist-item-details">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
            <button
              className="remove-wishlist-button"
              onClick={() => removeFromWishlist(product)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <GoBackButton />
    </div>
  );
};

export default WishlistPage;
