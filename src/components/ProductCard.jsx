import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import useSWR from "swr";
import "../assets/styles/productCard.css";
import wishlistOutline from "/wishlist-outline.png";
import wishlistFilled from "/wishlist-filled.png";
import { toast } from "react-toastify";
import { deleteProduct } from "../services/productService";  // Import the deleteProduct function
import DeleteConfirmationModal from "./DeleteConfirmationModal";  // Import the modal component

const Products = ({ products }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist();
  const { user } = useAuth();
  const { mutate } = useSWR("/wishlist");
  const [selectedColors, setSelectedColors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleDeleteProduct = async (productId) => {
    // Show the custom confirmation modal instead of window.confirm
    setProductToDelete(productId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        console.log("Deleting product with ID:", productToDelete);
        const response = await deleteProduct(productToDelete);
        console.log("Delete response:", response);

        if (response.success) {
          toast.success("Product deleted successfully!");
          mutate();  // Refresh the products list to reflect the deletion
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

  const handleEditProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!products || products.length === 0) {
    return <p>No products found in this category.</p>;
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const selectedColorIndex = selectedColors[product.id] ?? 0;
        const currentColor = product.colors?.[selectedColorIndex] || product.colors?.[0];

        const handleProductClick = () => {
          navigate(`/product/${product.id}`, {
            state: { selectedColor: currentColor },
          });
        };

        const wishlistItem = wishlist.find(
          (item) =>
            item.productId === product.id &&
            item.selectedColor === currentColor?.imageUrl
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
                name: product.name,
                price: product.price,
                selectedSize: null,
                selectedColor: currentColor?.imageUrl,
              });
              toast.success(`${product.name} added to your wishlist!`);
            }
            mutate();
          } catch (error) {
            console.error("Error updating wishlist:", error);
          }
        };

        return (
          <div key={product.id} className="product-card" onClick={handleProductClick}>
            {/* Admin Delete Button */}
            {user && (user.role === "ADMIN" || user.role === "ROOT_ADMIN") && (
              <div
                className="delete-product"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteProduct(product.id);  // Trigger deleteProduct on click
                }}
              >
                ×
              </div>
            )}

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
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
              </div>

              <div className="color-options">
                {product.colors?.map((color, index) => (
                  <div
                    key={`color-${index}`}
                    className={`color-circle ${
                      index === selectedColorIndex ? "selected" : ""
                    }`}
                    style={{ backgroundImage: `url(${color.imageUrl})` }}
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
        );
      })}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        productName={products.find((product) => product.id === productToDelete)?.name}
      />
    </div>
  );
};

export default Products;
