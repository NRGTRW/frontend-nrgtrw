import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext"; // ✅ Wishlist context
import { useAuth } from "../context/AuthContext"; // ✅ Auth check
import useSWR from "swr"; // ✅ Ensure data refresh
import "../assets/styles/productCard.css";
import wishlistOutline from "/wishlist-outline.png";
import wishlistFilled from "/wishlist-filled.png";

const Products = ({ products }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, wishlist, loadWishlist } = useWishlist();
  const { user } = useAuth(); // ✅ Get logged-in user
  const { mutate } = useSWR("/wishlist"); // ✅ Auto refresh wishlist on DB change

  if (!products || products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const [selectedColorIndex, setSelectedColorIndex] = useState(0);
        const currentColor = product.colors?.[selectedColorIndex];

        const handleProductClick = () => {
          navigate(`/product/${product.id}`, {
            state: { selectedColor: currentColor },
          });
        };

        const productKey = `${product.id}-${currentColor?.imageUrl}`;
        const isInWishlist = wishlist.some(
          (item) => item.productId === product.id && item.selectedColor === currentColor?.imageUrl
        );

        const handleWishlistToggle = async (e) => {
          e.stopPropagation(); // ✅ Prevent navigation when clicking the heart

          if (!user) {
            alert("You need to log in to add items to your wishlist.");
            return;
          }

          try {
            if (isInWishlist) {
              await removeFromWishlist(product.id, null, currentColor?.imageUrl);
            } else {
              await addToWishlist({
                id: product.id,
                name: product.name,
                price: product.price,
                selectedSize: null,
                selectedColor: currentColor?.imageUrl,
              });
            }

            // ✅ Refresh wishlist immediately
            await loadWishlist();
            mutate(); // ✅ Trigger re-fetch of wishlist data
          } catch (error) {
            console.error("Error updating wishlist:", error);
          }
        };

        return (
          <div key={product.id} className="product-card" onClick={handleProductClick}>
            {/* Image Container */}
            <div className="image-container">
              <img src={currentColor?.imageUrl || product.imageUrl} alt={product.name} className="product-image" />
              <img src={currentColor?.hoverImage || product.imageUrl} alt={`${product.name} hover`} className="hover-image" />
            </div>

            {/* Hover Overlay */}
            <div className="hover-overlay">
              {/* ✅ Wishlist Button in Top-Right */}
              <img
                src={isInWishlist ? wishlistFilled : wishlistOutline}
                alt="Wishlist"
                className="wishlist-button"
                onClick={handleWishlistToggle}
              />

              <div className="product-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>

              <div className="color-options">
                {product.colors?.map((color, index) => (
                  <div
                    key={`color-${index}`}
                    className={`color-circle ${index === selectedColorIndex ? "selected" : ""}`}
                    style={{ backgroundImage: `url(${color.imageUrl})` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(index);
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
