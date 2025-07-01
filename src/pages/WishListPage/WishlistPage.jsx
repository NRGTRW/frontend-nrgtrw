import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import useSWR from "swr"; // Auto-refresh mechanism
import api from "../../services/api"; // Fetch wishlist data
import "./wishlistPage.css";

// Fetch wishlist function with proper error handling
const fetchWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    console.log("✅ Wishlist API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to fetch wishlist:",
      error.response?.data || error.message,
    );
    return [];
  }
};

const WishlistPage = () => {
  const { removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  // Automatically refetch the wishlist every 3 seconds
  const { data: wishlist = [], mutate } = useSWR("/wishlist", fetchWishlist, {
    refreshInterval: 3000,
  });

  // If wishlist is empty, show a centered message with a "Browse Products" button
  if (!wishlist.length) {
    return (
      <div className="wishlist-page empty">
        <h2>Your wishlist is empty. Start adding your favorites!</h2>
        <div className="browse-button-container">
          <button
            className="browse-products-button"
            onClick={() => navigate("/clothing")}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="spacer-bar"></div>
      <h2>Your Wishlist</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => {
          if (!item.product) {
            console.warn("⚠️ Missing product data for item:", item);
            return (
              <div className="wishlist-card" key={item.id}>
                <p>⚠️ Product not found</p>
              </div>
            );
          }

          // Ensure correct color is displayed
          const selectedColor = item.selectedColor || item.product.imageUrl;
          console.log(
            `🎨 Displaying ${item.product.name} with color:`,
            selectedColor,
          );

          return (
            <div className="wishlist-card" key={item.id}>
              <div
                className="wishlist-image-container"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <img
                  src={selectedColor || "/fallback-image.jpg"} // ✅ Uses `selectedColor` correctly
                  alt={item.product.name || "Unnamed Product"}
                  className="wishlist-product-image"
                />
                {item.product.hoverImage && (
                  <img
                    src={item.product.hoverImage}
                    alt={`Hover - ${item.product.name}`}
                    className="wishlist-hover-image"
                  />
                )}
              </div>
              <div className="wishlist-product-info">
                <h3 className="wishlist-product-name">
                  {item.product.name || "Unnamed Product"}
                </h3>
                <p className="wishlist-product-price">
                  ${item.product.price ? item.product.price.toFixed(2) : "N/A"}
                </p>
                {item.selectedSize && <p>Size: {item.selectedSize}</p>}
              </div>
              <div className="wishlist-action-buttons">
                <button
                  className="wishlist-action-button remove-from-wishlist-button"
                  onClick={async (e) => {
                    e.stopPropagation(); // Prevent accidental navigation
                    await removeFromWishlist(item.id); // Use wishlist ID instead of productId
                    mutate(); // Update UI immediately after removing
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="browse-button-container">
        <button
          className="browse-products-button"
          onClick={() => navigate("/clothing")}
        >
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default WishlistPage;
