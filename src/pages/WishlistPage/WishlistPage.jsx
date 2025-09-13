import React from "react";
import { useWishlist } from "../../context/WishlistContext";
import { useNavigate } from "react-router-dom";
import useSWR from "swr"; // Auto-refresh mechanism
import api from "../../services/api"; // Fetch wishlist data
import "./wishlistPage.css";
import { useTranslation } from "react-i18next";

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

const getProductName = (translations, currentLanguage, t) => {
  if (!translations || translations.length === 0) return null;
  // Try exact match first
  let translation = translations.find((tr) => tr.language === currentLanguage);
  // If not found, try matching the base language (e.g., "en" from "en-US")
  if (!translation && currentLanguage.includes("-")) {
    const baseLang = currentLanguage.split("-")[0];
    translation = translations.find((tr) => tr.language === baseLang);
  }
  // Fallback: use the first translation if available
  return translation ? translation.name : null;
};

const WishlistPage = () => {
  const { t, i18n } = useTranslation();
  const wishlistContext = useWishlist();
  const removeFromWishlist = wishlistContext?.removeFromWishlist;
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

          const productName =
            getProductName(item.product.translations, i18n.language, t) ||
            t("wishlistItem.unnamedProduct");

          // Use the imageUrl from the translation if available
          const selectedColor =
            item.selectedColor ||
            (item.product.translations &&
              item.product.translations[0].imageUrl) ||
            item.product.imageUrl;

          return (
            <div className="wishlist-card" key={item.id}>
              <div
                className="wishlist-image-container"
                onClick={() => navigate(`/product/${item.productId}`)}
              >
                <img
                  src={selectedColor || "/fallback-image.jpg"}
                  alt={productName}
                  className="wishlist-product-image"
                />
                {item.product.hoverImage && (
                  <img
                    src={item.product.hoverImage}
                    alt={`${t("wishlistItem.hoverAlt")} - ${productName}`}
                    className="wishlist-hover-image"
                  />
                )}
              </div>
              <div className="wishlist-product-info">
                <h3 className="wishlist-product-name">{productName}</h3>
                <p className="wishlist-product-price">
                  {t("wishlistPage.price")}: $
                  {item.product.price ? item.product.price.toFixed(2) : "N/A"}
                </p>
                {item.selectedSize && (
                  <p>
                    {t("wishlistPage.size")}: {item.selectedSize}
                  </p>
                )}
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
