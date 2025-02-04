import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext"; // ✅ Wishlist context
import { useAuth } from "../context/AuthContext"; // ✅ Auth check
import useSWR from "swr"; // ✅ SWR for refreshing data
import "../assets/styles/productCard.css";
import wishlistOutline from "/wishlist-outline.png";
import wishlistFilled from "/wishlist-filled.png";
import {toast} from "react-toastify";

const Products = ({ products }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();
  const { mutate } = useSWR("/wishlist"); // ✅ Re-fetch after changes

  // ✅ Store selected colors in a state object (per product ID)
  const [selectedColors, setSelectedColors] = useState({});

  if (!products || products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const selectedColorIndex =
          selectedColors[product.id] ?? 0; // Default to first color
        const currentColor = product.colors?.[selectedColorIndex] || product.colors?.[0];

        const handleProductClick = () => {
          navigate(`/product/${product.id}`, {
            state: { selectedColor: currentColor },
          });
        };

        // Check if this product/color combo is in the wishlist
        const wishlistItem = wishlist.find(
          (item) =>
            item.productId === product.id &&
            item.selectedColor === currentColor?.imageUrl
        );
        const isInWishlist = !!wishlistItem;

        const handleWishlistToggle = async (e) => {
          e.stopPropagation(); // ✅ Prevent card navigation when clicking wishlist

          if (!user) {
            toast.info("You need to log in to manage your wishlist.");
            return;
          }

          try {
            if (isInWishlist) {
              await removeFromWishlist(wishlistItem.id);
            } else {
              await addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                selectedSize: null,
                selectedColor: currentColor?.imageUrl,
              });
              toast.success(`${product.name} added to your wishlist!`);
            }
            mutate(); // ✅ Refresh the wishlist
          } catch (error) {
            console.error("Error updating wishlist:", error);
          }
        };

        return (
          <div key={product.id} className="product-card" onClick={handleProductClick}>
            {/* Image Container */}
            <div className="image-container">
              <img
                src={currentColor?.imageUrl || product.imageUrl}
                alt={product.name}
                className="product-image"
              />
              <img
                src={currentColor?.hoverImage || product.imageUrl}
                alt={`${product.name} hover`}
                className="hover-image"
              />
            </div>

            {/* Hover Overlay */}
            <div className="hover-overlay">
              <div className="wishlist-button-container">
                {/* ✅ Prevent event bubbling on wishlist button */}
                <img
                  src={isInWishlist ? wishlistFilled : wishlistOutline}
                  alt="Wishlist"
                  className="wishlist-button"
                  onClick={handleWishlistToggle}
                />
              </div>

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>

              {/* Color Options */}
              <div className="color-options">
                {product.colors?.map((color, index) => (
                  <div
                    key={`color-${index}`}
                    className={`color-circle ${
                      index === selectedColorIndex ? "selected" : ""
                    }`}
                    style={{ backgroundImage: `url(${color.imageUrl})` }}
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevent accidental navigation
                      setSelectedColors((prev) => ({
                        ...prev,
                        [product.id]: index, // ✅ Update selected color per product
                      }));
                    }}
                    title={color.colorName}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Products;
