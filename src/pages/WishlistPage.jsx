import React from "react";
import { useWishlist } from "../context/WishlistContext";
import GoBackButton from "../components/GoBackButton";
import { useNavigate } from "react-router-dom";
import "../assets/styles/wishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  if (!wishlist.length) {
    return (
      <div className="wishlist-page empty">
        <h2>Your wishlist is empty. Start adding your favorites!</h2>
        <GoBackButton text="Browse Products" />
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="spacer-bar"></div>
      <h2>Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div className="wishlist-card" key={item.id}>
            <div
              className="wishlist-image-container"
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <img
                src={item.selectedColor}
                alt={item.product.name}
                className="wishlist-product-image"
              />
              {item.product.hoverImage && (
                <img
                  src={item.product.hoverImage}
                  alt={item.product.name}
                  className="wishlist-hover-image"
                />
              )}
            </div>
            <div className="wishlist-product-info">
              <h3 className="wishlist-product-name">{item.product.name}</h3>
              <p className="wishlist-product-price">
                ${item.product.price.toFixed(2)}
              </p>
              <p>Size: {item.selectedSize}</p>
            </div>
            <div className="wishlist-action-buttons">
              <button
                className="wishlist-action-button remove-from-wishlist-button"
                onClick={() => removeFromWishlist(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <GoBackButton />
    </div>
  );
};

export default WishlistPage;
