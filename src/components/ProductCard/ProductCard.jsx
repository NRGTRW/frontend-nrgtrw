import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import useSWR from "swr";
import "./productCard.css";
import wishlistOutline from "/wishlist-outline.png";
import wishlistFilled from "/wishlist-filled.png";
import { toast } from "react-toastify";
import { deleteProduct } from "../../services/productService"; // Import the deleteProduct function
import DeleteConfirmationModal from "../Modals/DeleteConfirmationModal"; // Import the modal component
import { useTranslation } from "react-i18next";
import ProductVoteModal from "../ProductVoteModal/ProductVoteModal";

const S3_BASE = "https://nrgtrw-images.s3.eu-central-1.amazonaws.com/";
function getS3Url(path) {
  if (!path) return undefined;
  // If the path is a local image (starts with /images/ or /public/), return as-is
  if (path.startsWith("/images/") || path.startsWith("/public/")) return path;
  // If the path is already an absolute URL, return as-is
  if (path.startsWith("http")) return path;
  // Otherwise, prepend the S3 base URL
  return S3_BASE + (path.startsWith("/") ? path.slice(1) : path);
}

const Products = ({
  products,
  showVoteButton = false,
  showSizes = false,
  categoryName,
}) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();
  const { mutate } = useSWR("/wishlist");
  const [selectedColors, setSelectedColors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { i18n, t } = useTranslation();
  const [voteModalOpen, setVoteModalOpen] = useState(false);
  const [voteProduct, setVoteProduct] = useState(null);

  const handleDeleteProduct = async (productId) => {
    setProductToDelete(productId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        const response = await deleteProduct(productToDelete);
        if (response.success) {
          toast.success("Product deleted successfully!");
          mutate();
        } else {
          toast.error("Failed to delete product.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("An error occurred while deleting the product.");
      }
      setShowModal(false);
    }
  };

  const handleProductClick = (product, currentColor) => {
    navigate(`/product/${product.id}`, {
      state: { selectedColor: currentColor },
    });
  };

  if (!products || products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        // Use i18next to get the translated product name.
        const currentLanguage = i18n.language;
        const translation =
          product.translations && product.translations.length > 0
            ? product.translations.find(
                (tr) => tr.language === currentLanguage,
              ) || product.translations[0]
            : null;
        const displayName = translation ? translation.name : product.name;

        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const currentColor =
          product.colors?.[selectedColorIndex] || product.colors?.[0];

        const wishlistItem = wishlist.find(
          (item) =>
            item.productId === product.id &&
            item.selectedColor === currentColor?.imageUrl,
        );
        const isInWishlist = !!wishlistItem;

        const handleWishlistToggle = async (e) => {
          e.stopPropagation();
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
                name: displayName,
                price: product.price,
                selectedSize: null,
                selectedColor: currentColor?.imageUrl,
              });
              toast.success(`${displayName} added to your wishlist!`);
            }
            mutate();
          } catch (error) {
            console.error("Error updating wishlist:", error);
          }
        };

        return (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProductClick(product, currentColor)}
            style={{ position: "relative" }}
          >
            {user && (user.role === "ADMIN" || user.role === "ROOT_ADMIN") && (
              <div
                className="delete-product"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProduct(product.id);
                }}
              >
                ×
              </div>
            )}

            <div className="image-container">
              <img
                src={
                  getS3Url(currentColor?.imageUrl) || getS3Url(product.imageUrl)
                }
                alt={displayName}
                className="product-image"
              />
              <img
                src={
                  getS3Url(currentColor?.hoverImage) ||
                  getS3Url(product.imageUrl)
                }
                alt={`${displayName} hover`}
                className="hover-image"
              />
              {showVoteButton && (
                <button
                  className="vote-btn-on-card vote-btn-overlay"
                  onClick={(e) => {
                    e.stopPropagation();
                    setVoteProduct(product);
                    setVoteModalOpen(true);
                  }}
                >
                  Vote for Product
                </button>
              )}
            </div>

            <div className="hover-overlay">
              <div className="wishlist-button-container">
                <img
                  src={isInWishlist ? wishlistFilled : wishlistOutline}
                  alt="Wishlist"
                  className="wishlist-button"
                  onClick={handleWishlistToggle}
                />
              </div>

              <div className="product-info">
                <h3>{displayName}</h3>
                <p>${product.price.toFixed(2)}</p>
                {/* Remove size display from card */}
                {/* {showSizes && product.sizes && product.sizes.length > 0 && (
                  <div className="card-size-row">
                    {product.sizes.map((size) => (
                      <span key={size.id || size.size} className="card-size-item">{size.size}</span>
                    ))}
                  </div>
                )} */}
                <div className="color-options">
                  {product.colors?.map((color, index) => (
                    <div
                      key={`color-${index}`}
                      className={`color-circle ${
                        index === selectedColorIndex ? "selected" : ""
                      }`}
                      style={{
                        backgroundImage: `url('${color.imageUrl}')`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedColors((prev) => ({
                          ...prev,
                          [product.id]: index,
                        }));
                      }}
                      title={color.colorName}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <ProductVoteModal
              isOpen={voteModalOpen}
              onClose={() => setVoteModalOpen(false)}
              product={voteProduct}
            />
            <DeleteConfirmationModal
              showModal={showModal}
              onClose={() => setShowModal(false)}
              onConfirm={confirmDelete}
              productName={products.find((p) => p.id === productToDelete)?.name}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Products;
