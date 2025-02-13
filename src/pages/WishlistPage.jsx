import React from "react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import api from "../services/api";
import "../assets/styles/wishlistPage.css";

const fetchWishlist = async () => {
  try {
    const response = await api.get("/wishlist");
    console.log("✅ Wishlist API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch wishlist:", error.response?.data || error.message);
    return [];
  }
};

const WishlistPage = () => {
  const { t } = useTranslation();
  const { removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const { data: wishlist = [], mutate } = useSWR("/wishlist", fetchWishlist, {
    refreshInterval: 3000,
  });

  if (!wishlist.length) {
    return (
      <div className="wishlist-page empty">
        <h2>{t("wishlistPage.emptyMessage")}</h2>
        <div className="browse-button-container">
          <button
            className="browse-products-button"
            onClick={() => navigate("/clothing")}
          >
            {t("wishlistPage.browseButton")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="spacer-bar"></div>
      <h2>{t("wishlistPage.title")}</h2>
      <div className="wishlist-grid">
        {wishlist.map((item) => {
          if (!item.product) {
            console.warn("⚠️ Missing product data for item:", item);
            return (
              <div className="wishlist-card" key={item.id}>
                <p>{t("wishlistPage.productNotFound")}</p>
              </div>
            );
          }

          const selectedColor = item.selectedColor || item.product.imageUrl;

          return (
            <div className="wishlist-card" key={item.id}>
              <div
                className="wishlist-image-container"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <img
                  src={selectedColor || "/fallback-image.jpg"}
                  alt={item.product.name || t("wishlistItem.unnamedProduct")}
                  className="wishlist-product-image"
                />
                {item.product.hoverImage && (
                  <img
                    src={item.product.hoverImage}
                    alt={`${t("wishlistItem.hoverAlt")} - ${item.product.name}`}
                    className="wishlist-hover-image"
                  />
                )}
              </div>
              <div className="wishlist-product-info">
                <h3 className="wishlist-product-name">
                  {item.product.name || t("wishlistItem.unnamedProduct")}
                </h3>
                <p className="wishlist-product-price">
                  {t("wishlistPage.price")}: ${item.product.price ? item.product.price.toFixed(2) : "N/A"}
                </p>
                {item.selectedSize && <p>{t("wishlistPage.size")}: {item.selectedSize}</p>}
              </div>
              <div className="wishlist-action-buttons">
                <button
                  className="wishlist-action-button remove-from-wishlist-button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await removeFromWishlist(item.id);
                    mutate();
                  }}
                >
                  {t("wishlistPage.removeButton")}
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
          {t("wishlistPage.browseMore")}
        </button>
      </div>
    </div>
  );
};

export default WishlistPage;
