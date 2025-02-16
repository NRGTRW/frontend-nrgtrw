import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../assets/styles/productPage.css";
import "../assets/styles/createAProductPage.css";
import { getToken } from "../context/tokenUtils";
import InsertColorName from "../components/InsertColorName";
import { useTranslation } from "react-i18next";

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_QUANTITY = 99;

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  // Fetch product & categories using SWR.
  const { data: product, error, mutate } = useSWR(
    productId ? `${import.meta.env.VITE_API_URL}/products/${productId}` : null,
    () => fetchProductById(productId)
  );
  const { data: categories } = useSWR(
    `${import.meta.env.VITE_API_URL}/categories`,
    fetcher,
    { fallbackData: [] }
  );

  // Debug: log the fetched product.
  useEffect(() => {
    console.log("Fetched product:", product);
  }, [product]);

  // --- Translation helper ---
  // Use the current language from i18next so that the component re-renders on language change.
  let translation = {};
  let displayName = "";
  let displayDescription = "";
  if (product) {
    const currentLanguage = i18n.language;
    if (product.translations && product.translations.length > 0) {
      translation =
        product.translations.find((tr) => tr.language === currentLanguage) ||
        product.translations[0];
    }
    displayName = translation.name || product.name || "Unnamed Product";
    displayDescription =
      translation.description ||
      product.description ||
      "No description available.";
  }

  // Viewing mode state.
  const initialColorIndex = product?.colors
    ? product.colors.findIndex(
        (color) =>
          color.imageUrl === location.state?.selectedColor?.imageUrl
      )
    : 0;
  const [selectedColorIndex, setSelectedColorIndex] = useState(
    initialColorIndex !== -1 ? initialColorIndex : 0
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [maxQuantityMessage, setMaxQuantityMessage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Admin edit mode state.
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [editColors, setEditColors] = useState([]);
  const [showNewColorModal, setShowNewColorModal] = useState(false);

  // Load product data into edit state when editing.
  useEffect(() => {
    if (editing && product && product.colors) {
      const currentLanguage = i18n.language;
      const currentTranslation =
        product.translations?.find((tr) => tr.language === currentLanguage) ||
        product.translations?.[0] ||
        {};
      setEditForm({
        name: currentTranslation.name || "",
        description: currentTranslation.description || "",
        price: product.price,
        category: product.categoryId,
      });
      setEditColors(
        product.colors.map((color) => ({
          id: color.id,
          colorName: color.colorName,
          imageUrl: color.imageUrl,
          hoverImage: color.hoverImage,
          newImageFile: null,
          newHoverImageFile: null,
        }))
      );
    }
  }, [product, editing, i18n.language]);

  const sortedSizes = product?.sizes
    ? [...product.sizes].sort(
        (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
      )
    : [];
  useEffect(() => {
    if (sortedSizes.length && !selectedSize) {
      setSelectedSize(sortedSizes[0].size);
    }
  }, [sortedSizes, selectedSize]);

  const handleQuantityChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value === "") value = 1;
    const newQuantity = Math.min(Math.max(Number(value), 1), MAX_QUANTITY);
    setQuantity(newQuantity);
    setMaxQuantityMessage(newQuantity >= MAX_QUANTITY);
  };

  const increaseQuantity = () => {
    if (quantity < MAX_QUANTITY) setQuantity(quantity + 1);
    else setMaxQuantityMessage(true);
  };

  const decreaseQuantity = () => {
    setQuantity(Math.max(quantity - 1, 1));
    setMaxQuantityMessage(false);
  };

  const handleAddToCart = () => {
    if (!product) {
      toast.error("Product data is incomplete");
      return;
    }
    const selectedColor = product.colors?.[selectedColorIndex] || {};
    if (!selectedSize || !selectedColor.imageUrl) {
      toast.error("Please select size and color");
      return;
    }
    const existingItem = cart.find(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor.imageUrl
    );
    const currentQuantity = existingItem?.quantity || 0;
    const newQuantity = Math.min(currentQuantity + quantity, MAX_QUANTITY);
    if (newQuantity <= currentQuantity) {
      toast.error(`Maximum quantity of ${MAX_QUANTITY} reached`);
      return;
    }
    addToCart({
      productId: product.id,
      name: displayName,
      price: product.price,
      selectedSize,
      selectedColor: selectedColor.imageUrl,
      quantity,
      imageUrl: selectedColor.imageUrl,
    });
    if (getToken()) {
      toast.success(
        existingItem
          ? `Added ${quantity} more (Total: ${newQuantity})`
          : `Added ${quantity} ${displayName} to cart!`
      );
    }
  };

  const handleWishlistToggle = () => {
    if (!user) {
      toast.error("Login to use wishlist.");
      return;
    }
    const selectedColor = product.colors?.[selectedColorIndex] || {};
    addToWishlist({
      id: product.id,
      name: displayName,
      price: product.price,
      selectedSize,
      selectedColor: selectedColor.imageUrl,
    })
      .then(() => {
        setIsWishlisted(true);
        toast.success(`Added ${displayName} to wishlist!`);
        setTimeout(() => setIsWishlisted(false), 2500);
      })
      .catch(() =>
        toast.error(`Failed to add ${displayName} to wishlist.`)
      );
  };

  // --- Admin Edit Handlers ---
  const handleEditColorNameChange = (e, index) => {
    const updated = [...editColors];
    updated[index].colorName = e.target.value;
    setEditColors(updated);
  };

  const handleEditColorFileChange = (e, index, field) => {
    const file = e.target.files[0];
    if (file) {
      const updated = [...editColors];
      if (field === "imageUrl") {
        updated[index].newImageFile = file;
      } else if (field === "hoverImage") {
        updated[index].newHoverImageFile = file;
      }
      setEditColors(updated);
    }
  };

  const handleRemoveColor = (index) => {
    const updated = [...editColors];
    updated.splice(index, 1);
    setEditColors(updated);
  };

  const handleAddColor = () => {
    setShowNewColorModal(true);
  };

  const handleConfirmNewColor = async (newColorName) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product.id}/add-color`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ colorName: newColorName }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setEditColors((prev) => [...prev, result.color]);
        toast.success("Color added successfully");
      } else {
        toast.error("Failed to add color");
      }
    } catch (error) {
      console.error("Add color error:", error);
      toast.error("Failed to add color");
    }
    setShowNewColorModal(false);
  };

  const handleCancelNewColor = () => {
    setShowNewColorModal(false);
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("categoryId", editForm.category);
      formData.append(
        "colors",
        JSON.stringify(
          editColors.map((color) => ({
            id: color.id,
            colorName: color.colorName,
          }))
        )
      );
      editColors.forEach((color) => {
        if (color.newImageFile) {
          formData.append(`colorImage_${color.id}`, color.newImageFile);
        }
        if (color.newHoverImageFile) {
          formData.append(`colorHoverImage_${color.id}`, color.newHoverImageFile);
        }
      });
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: formData,
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Product updated successfully");
        setEditing(false);
        mutate();
      } else {
        toast.error("Product update failed");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to update product.");
    }
  };

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>
      {editing ? (
        <div className="cp-page">
          <div className="cp-page__container">
            <div className="cp-page__details-section">
              <h2>Edit Product</h2>
              <div className="cp-page__input-group">
                <label className="cp-page__input-label">
                  Name <span className="cp-page__required-marker">*</span>
                </label>
                <input
                  type="text"
                  className="cp-page__form-input"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Enter product name"
                />
              </div>
              <div className="cp-page__input-group">
                <label className="cp-page__input-label">
                  Description <span className="cp-page__required-marker">*</span>
                </label>
                <textarea
                  className="cp-page__form-textarea"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Enter product description"
                ></textarea>
              </div>
              <div className="cp-page__input-group">
                <label className="cp-page__input-label">
                  Price <span className="cp-page__required-marker">*</span>
                </label>
                <input
                  type="number"
                  className="cp-page__form-input"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  placeholder="Enter product price"
                />
              </div>
              <div className="cp-page__input-group">
                <label className="cp-page__input-label">
                  Category <span className="cp-page__required-marker">*</span>
                </label>
                <select
                  className="cp-page__form-select"
                  name="category"
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  required
                >
                  <option value="">Select Category</option>
                  {Array.isArray(categories) &&
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <h3>Edit Colors</h3>
              {editColors.map((color, index) => (
                <div
                  key={color.id !== null ? color.id : `new-${index}`}
                  className="cp-page__color-option"
                >
                  <div className="cp-page__input-group">
                    <label className="cp-page__input-label">
                      Color Name <span className="cp-page__required-marker">*</span>
                    </label>
                    <input
                      type="text"
                      className="cp-page__form-input"
                      value={color.colorName}
                      onChange={(e) => handleEditColorNameChange(e, index)}
                      placeholder="Enter color name"
                    />
                  </div>
                  <div className="cp-page__input-group">
                    <label className="cp-page__input-label">Color Image</label>
                    <input
                      type="file"
                      className="cp-page__file-input"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditColorFileChange(e, index, "imageUrl")
                      }
                    />
                  </div>
                  <div className="cp-page__input-group">
                    <label className="cp-page__input-label">Hover Image</label>
                    <input
                      type="file"
                      className="cp-page__file-input"
                      accept="image/*"
                      onChange={(e) =>
                        handleEditColorFileChange(e, index, "hoverImage")
                      }
                    />
                  </div>
                  <div className="cp-page__preview-container">
                    <img
                      src={
                        color.newImageFile
                          ? URL.createObjectURL(color.newImageFile)
                          : color.imageUrl
                      }
                      alt="Color Preview"
                      className="cp-page__preview-image"
                    />
                    <img
                      src={
                        color.newHoverImageFile
                          ? URL.createObjectURL(color.newHoverImageFile)
                          : color.hoverImage
                      }
                      alt="Hover Preview"
                      className="cp-page__preview-image"
                      style={{ marginLeft: "1rem" }}
                    />
                  </div>
                  <div className="cp-page__button-group">
                    <button
                      className="cp-page__danger-btn"
                      onClick={() => handleRemoveColor(index)}
                    >
                      Remove Color
                    </button>
                  </div>
                </div>
              ))}
              <div className="cp-page__button-group">
                <button className="cp-page__action-btn" onClick={handleAddColor}>
                  Add Color
                </button>
              </div>
              <div className="cp-page__button-group">
                <button className="cp-page__action-btn" onClick={handleSave}>
                  Save
                </button>
                <button
                  className="cp-page__danger-btn"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          <InsertColorName
            show={showNewColorModal}
            onConfirm={handleConfirmNewColor}
            onCancel={handleCancelNewColor}
          />
        </div>
      ) : (
        <div className="product-container">
          <motion.img
            src={isWishlisted ? "/wishlist-filled.png" : "/wishlist-outline.png"}
            alt="Wishlist"
            className="wishlist-icon-productPage"
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          />
          <div className="product-images">
            <div className="image-carousel">
              <button
                className="carousel-arrow left-arrow"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? images.length - 1 : prev - 1
                  )
                }
              >
                ❮
              </button>
              <img
                src={images[currentImageIndex] || product.imageUrl}
                alt={`${displayName} - ${
                  product.colors?.[selectedColorIndex]?.colorName || "default"
                }`}
                className="main-image"
              />
              <button
                className="carousel-arrow right-arrow"
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === images.length - 1 ? 0 : prev + 1
                  )
                }
              >
                ❯
              </button>
            </div>
            <div className="color-thumbnails">
              {product.colors?.map((color, index) => (
                <img
                  key={color.id}
                  src={color.imageUrl}
                  alt={`${displayName} - ${color.colorName}`}
                  className={`thumbnail ${
                    selectedColorIndex === index ? "selected" : ""
                  }`}
                  onClick={() => setSelectedColorIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="product-details">
            <h1>{displayName}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{displayDescription}</p>
            <div className="size-quantity-row">
              <div className="size-selector">
                {sortedSizes.map((size) => (
                  <button
                    key={size.id}
                    className={`size-button ${
                      selectedSize === size.size ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSize(size.size)}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
              <div className="quantity-selector">
                <button
                  className="quantity-button minus"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="text"
                  className="quantity-input"
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <button
                  className="quantity-button plus"
                  onClick={increaseQuantity}
                  disabled={quantity >= MAX_QUANTITY}
                >
                  +
                </button>
              </div>
            </div>
            {maxQuantityMessage && (
              <p className="max-quantity-message">
                Maximum quantity reached! For bulk orders, please{" "}
                <a href="/contact-us" className="contact-link">
                  contact us
                </a>.
              </p>
            )}
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={!selectedSize || !quantity}
            >
              {t("cartPage.addToCart", "Add to Cart")}
            </button>
            {user &&
              (user.role === "ADMIN" || user.role === "ROOT_ADMIN") && (
                <div className="admin-actions">
                  <button
                    className="cp-page__action-btn"
                    onClick={() => setEditing(true)}
                  >
                    Edit Product
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
