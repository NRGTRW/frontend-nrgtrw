import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { fetchProductById, updateProduct } from "../services/productService";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import GoBackButton from "../components/GoBackButton";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import "../assets/styles/productPage.css";
import "../assets/styles/createAProductPage.css";
import { getToken } from "../context/tokenUtils";

// Constants
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
const MAX_QUANTITY = 99;

// A simple fetcher for SWR.
const fetcher = (url) => fetch(url).then((res) => res.json());

const ProductPage = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist } = useWishlist();
  const { user } = useAuth();

  // ------------------ Fetch Product Data ------------------
  const { data: product, error, mutate } = useSWR(
    productId ? `${import.meta.env.VITE_API_URL}/products/${productId}` : null,
    () => fetchProductById(productId)
  );

  // ------------------ Fetch Categories from DB ------------------
  const { data: categories } = useSWR(
    `${import.meta.env.VITE_API_URL}/categories`,
    fetcher,
    { fallbackData: [] }
  );

  // ------------------ Viewing Mode State ------------------
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

  // Sort sizes (if available)
  const sortedSizes = product?.sizes
    ? [...product.sizes].sort(
        (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size)
      )
    : [];

  // Define the current color and images array.
  const currentColor = product?.colors?.[selectedColorIndex] || {};
  const images = [currentColor.imageUrl, currentColor.hoverImage].filter(Boolean);

  // ------------------ Admin Edit Mode State ------------------
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // Set to the product's current category id
  });
  const [editColors, setEditColors] = useState([]);
  const [editing, setEditing] = useState(false);

  // Initialize admin edit state only once when editing becomes true.
  useEffect(() => {
    if (
      editing &&
      product &&
      user &&
      (user.role === "ADMIN" || user.role === "ROOT_ADMIN") &&
      editColors.length === 0
    ) {
      setEditForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.categoryId, // Use the current category id from product
      });
      // Make a copy of product.colors.
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
  }, [editing, product, user, editColors.length]);

  // ------------------ Effects & Handlers ------------------
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
    quantity < MAX_QUANTITY
      ? setQuantity((prev) => prev + 1)
      : setMaxQuantityMessage(true);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
    setMaxQuantityMessage(false);
  };

  const handleAddToCart = () => {
    if (!product || !product.id || !product.name || !product.price) {
      toast.error("Error: Incomplete product data");
      return;
    }
    const selectedColor = product.colors?.[selectedColorIndex] || {};
    const missingFields = [];
    if (product.sizes?.length > 0 && !selectedSize) missingFields.push("size");
    if (!selectedColor.imageUrl) missingFields.push("color");
    if (missingFields.length > 0) {
      toast.error(`Missing required: ${missingFields.join(", ")}`);
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
      name: product.name,
      price: product.price,
      selectedSize: selectedSize,
      selectedColor: selectedColor.imageUrl,
      quantity: quantity,
      imageUrl: selectedColor.imageUrl,
    });
    if (getToken()) {
      toast.success(
        existingItem
          ? `🛒 Added ${quantity} more (Total: ${newQuantity})`
          : `🛒 Added ${quantity} ${product.name} to cart!`
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
      name: product.name,
      price: product.price,
      selectedSize,
      selectedColor: selectedColor.imageUrl,
    })
      .then(() => {
        setIsWishlisted(true);
        toast.success(`Added ${product.name} to wishlist!`);
        setTimeout(() => setIsWishlisted(false), 2500);
      })
      .catch(() => toast.error(`Failed to add ${product.name} to wishlist.`));
  };

  // ------------------ Admin Edit Handlers ------------------
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
    setEditColors((prev) => [
      ...prev,
      {
        id: null,
        colorName: "",
        imageUrl: "",
        hoverImage: "",
        newImageFile: null,
        newHoverImageFile: null,
      },
    ]);
  };

  // Save changes in admin edit mode.
  const handleSave = async () => {
    try {
      const payload = {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        categoryId: editForm.category, // Should be a valid category id from the DB.
        colors: editColors.map((color) => ({
          id: color.id, // if null, backend will create a new record
          colorName: color.colorName,
        })),
      };

      // Call the updateProduct service (which sends a PUT request to /api/products/:id).
      const updateResponse = await updateProduct(product.id, payload);
      if (!updateResponse.success) {
        toast.error("Product update failed");
        return;
      }

      // Merge updated product colors with our file selections.
      const updatedProduct = updateResponse.updatedProduct;
      const mergedColors = updatedProduct.colors.map((color) => {
        const local = editColors.find((c) => c.id === color.id) || {};
        return {
          ...color,
          newImageFile: local.newImageFile || null,
          newHoverImageFile: local.newHoverImageFile || null,
        };
      });

      // Build FormData for image updates.
      const formData = new FormData();
      formData.append("productId", product.id);
      mergedColors.forEach((color) => {
        if (color.newImageFile) {
          formData.append(`colorImage_${color.id}`, color.newImageFile);
        }
        if (color.newHoverImageFile) {
          formData.append(`colorHoverImage_${color.id}`, color.newHoverImageFile);
        }
      });

      if ([...formData.entries()].length > 1) {
        const uploadResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/products/upload-images`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: formData,
          }
        );
        const uploadResult = await uploadResponse.json();
        if (!uploadResult.success) {
          toast.error("Image update failed");
          return;
        }
      }

      toast.success("Product updated successfully");
      setEditing(false);
      mutate(); // Revalidate product data instantly.
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product.");
    }
  };

  if (!product && !error) return <p>Loading product...</p>;
  if (error) return <p>Failed to load product. Please try again later.</p>;

  return (
    <div className="product-page">
      <GoBackButton />
      <div className="spacer-bar2"></div>
      {editing ? (
        // ------------------ Admin Edit Mode ------------------
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
        </div>
      ) : (
        // ------------------ Viewing Mode ------------------
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
                alt={`${product.name} - ${
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
                  alt={`${product.name} - ${color.colorName}`}
                  className={`thumbnail ${selectedColorIndex === index ? "selected" : ""}`}
                  onClick={() => setSelectedColorIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="product-details">
            <h1>{product.name}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            <div className="size-quantity-row">
              <div className="size-selector">
                {sortedSizes.map((size) => (
                  <button
                    key={size.id}
                    className={`size-button ${selectedSize === size.size ? "selected" : ""}`}
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
                Maximum quantity reached!
              </p>
            )}
            <button
              className="add-to-cart-button"
              onClick={handleAddToCart}
              disabled={!selectedSize || !quantity}
            >
              Add to Cart
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
