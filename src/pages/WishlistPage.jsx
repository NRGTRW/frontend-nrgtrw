import React from "react";
import { useWishlist } from "../context/WishlistContext";
import GoBackButton from "../components/GoBackButton";
import { useNavigate } from "react-router-dom";
import useSWR from "swr"; // ✅ Auto-refresh mechanism
import api from "../services/api"; // Fetch wishlist data
import "../assets/styles/wishlistPage.css";

const fetchWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

const WishlistPage = () => {
  const { removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // ✅ Automatically refetch the wishlist every 5 seconds
  const { data: wishlist = [], mutate } = useSWR("/wishlist", fetchWishlist, {
    refreshInterval: 3000, // ✅ Fetch new data every 5 seconds
  });

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
        {wishlist.map((item) => {
          if (!item.product) return null; // Ensure product data exists

          return (
            <div className="wishlist-card" key={item.id}>
              <div
                className="wishlist-image-container"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <img
                  src={item.selectedColor || item.product.imageUrl}
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
                {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              </div>
              <div className="wishlist-action-buttons">
              <button
                  className="wishlist-action-button remove-from-wishlist-button"
                  onClick={async (e) => {
                    e.stopPropagation(); // ✅ Prevent accidental navigation
                    await removeFromWishlist(item.id); // ✅ Use wishlist ID instead of productId
                    mutate(); // ✅ Update UI immediately after removing
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <GoBackButton />
    </div>
  );
};

export default WishlistPage;
