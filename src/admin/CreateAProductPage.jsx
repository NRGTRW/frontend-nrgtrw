import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoBackButton from "../components/GoBackButton";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/styles/createAProductPage.css";
import PublishConfirmationModal from "../components/PublishConfirmationModal";

const CreateAProductPage = () => {
  const navigate = useNavigate();

  // Default sizes for the product.
  const defaultSizes = ["S", "M", "L", "XL"];

  // State for categories (fetched from the API).
  const [categories, setCategories] = useState([]);

  // State for product form values.
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // will store the chosen category id (as string)
    sizes: [...defaultSizes],
    // Colors are handled via local state.
    colors: [
      {
        colorName: "",
        imageUrl: null,
        hoverImage: null,
        imageUrlPreview: null,
        hoverImagePreview: null,
      },
    ],
  });

  // State for form errors.
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch categories from API when the component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`
        );
        // Expecting response.data to be an array of category objects.
        setCategories(response.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Cleanup object URLs when unmounting.
  useEffect(() => {
    return () => {
      productDetails.colors.forEach((color) => {
        if (color.imageUrlPreview)
          URL.revokeObjectURL(color.imageUrlPreview);
        if (color.hoverImagePreview)
          URL.revokeObjectURL(color.hoverImagePreview);
      });
    };
  }, [productDetails]);

  // Handle changes for text input fields.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // Handle adding or removing sizes.
  const handleSizeChange = (action, size) => {
    if (action === "add") {
      if (!productDetails.sizes.includes(size)) {
        setProductDetails((prevState) => ({
          ...prevState,
          sizes: [...prevState.sizes, size],
        }));
      }
    } else if (action === "remove") {
      setProductDetails((prevState) => ({
        ...prevState,
        sizes: prevState.sizes.filter((s) => s !== size),
      }));
    }
    if (productDetails.sizes.length > 0) {
      setErrors((prevErrors) => ({ ...prevErrors, sizes: "" }));
    }
  };

  // Handle changes for the color options (both text and file inputs).
  const handleColorInputChange = (e, index, field) => {
    const newColors = [...productDetails.colors];
    if (field === "imageUrl" || field === "hoverImage") {
      const file = e.target.files[0];
      if (file) {
        const previewURL = URL.createObjectURL(file);
        newColors[index] = {
          ...newColors[index],
          [field]: file,
          [`${field}Preview`]: previewURL,
        };
      }
    } else {
      const { name, value } = e.target;
      newColors[index] = { ...newColors[index], [name]: value };
    }
    setProductDetails((prevState) => ({
      ...prevState,
      colors: newColors,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${field === "colorName" ? "colorName" : field}_${index}`]: "",
    }));
  };

  // Add or remove a color option.
  const handleColorChange = (action) => {
    if (action === "add") {
      setProductDetails((prevState) => ({
        ...prevState,
        colors: [
          ...prevState.colors,
          {
            colorName: "",
            imageUrl: null,
            hoverImage: null,
            imageUrlPreview: null,
            hoverImagePreview: null,
          },
        ],
      }));
    } else if (action === "remove") {
      if (productDetails.colors.length > 1) {
        setProductDetails((prevState) => ({
          ...prevState,
          colors: prevState.colors.slice(0, -1),
        }));
      }
    }
  };

  // Removed the main image input and corresponding handler.
  // The main image will be copied from the first color's image.

  // Validate the form fields.
  const validateForm = () => {
    const newErrors = {};
    if (!productDetails.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!productDetails.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!productDetails.price || parseFloat(productDetails.price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    if (!productDetails.category) {
      newErrors.category = "Category is required";
    }
    if (!productDetails.sizes || productDetails.sizes.length === 0) {
      newErrors.sizes = "At least one size must be selected";
    }
    productDetails.colors.forEach((color, index) => {
      if (!color.colorName.trim()) {
        newErrors[`colorName_${index}`] = "Color name is required";
      }
      if (!(color.imageUrl instanceof File)) {
        newErrors[`colorImage_${index}`] = "Color image is required";
      }
      if (!(color.hoverImage instanceof File)) {
        newErrors[`colorHoverImage_${index}`] = "Color hover image is required";
      }
    });
    return newErrors;
  };

  // Optional: Cancel publish action.
  const cancelPublish = () => {
    setShowConfirmation(false);
  };

  // Confirm and create the product.
  const confirmPublish = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    const productData = {
      name: productDetails.name,
      description: productDetails.description,
      price: parseFloat(productDetails.price),
      categoryId: productDetails.category, // This is now a category id from the select.
      sizes: productDetails.sizes,
      colors: productDetails.colors.map((color) => ({
        colorName: color.colorName,
      })),
    };

    try {
      // Create the product (without image files).
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (response.data.success) {
        const productId = response.data.product.id;
        // Upload image files.
        await handleImageUploads(productId);
        toast.success("Product published successfully!");
        navigate("/clothing");
      } else {
        toast.error("Failed to publish product");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to publish product");
    }
  };

  // Handle image uploads via a separate endpoint.
  // Instead of a separate main image, copy the first color's image.
  const handleImageUploads = async (productId) => {
    const formData = new FormData();
    // Copy the first color's image as the main image.
    if (productDetails.colors[0]?.imageUrl instanceof File) {
      formData.append("mainImage", productDetails.colors[0].imageUrl);
    }
    productDetails.colors.forEach((color, index) => {
      if (color.imageUrl instanceof File) {
        formData.append(`colorImage_${index}`, color.imageUrl);
      }
      if (color.hoverImage instanceof File) {
        formData.append(`colorHoverImage_${index}`, color.hoverImage);
      }
    });
    formData.append("productId", productId);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/products/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handlePublish = () => {
    confirmPublish();
  };

  return (
    <div className="cp-page">
      <GoBackButton />
      <div className="cp-page__spacer-bar"></div>
      <div className="cp-page__container">
        <motion.div
          className="cp-page__image-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Product Images</h2>
          <div className="cp-page__input-group">
            <label>Color Options</label>
            {productDetails.colors.map((color, index) => (
              <div key={index} className="cp-page__color-option">
                <input
                  type="text"
                  className="cp-page__form-input"
                  name="colorName"
                  placeholder="Color Name"
                  value={color.colorName}
                  onChange={(e) => handleColorInputChange(e, index, "colorName")}
                />
                {errors[`colorName_${index}`] && (
                  <span className="cp-page__error">
                    {errors[`colorName_${index}`]}
                  </span>
                )}
                <input
                  type="file"
                  className="cp-page__file-input"
                  name="imageUrl"
                  accept="image/*"
                  onChange={(e) => handleColorInputChange(e, index, "imageUrl")}
                />
                {errors[`colorImage_${index}`] && (
                  <span className="cp-page__error">
                    {errors[`colorImage_${index}`]}
                  </span>
                )}
                {color.imageUrlPreview && (
                  <div className="cp-page__preview-container">
                    <img
                      src={color.imageUrlPreview}
                      alt="Color Preview"
                      className="cp-page__preview-image"
                    />
                  </div>
                )}
                <input
                  type="file"
                  className="cp-page__file-input"
                  name="hoverImage"
                  accept="image/*"
                  onChange={(e) => handleColorInputChange(e, index, "hoverImage")}
                />
                {errors[`colorHoverImage_${index}`] && (
                  <span className="cp-page__error">
                    {errors[`colorHoverImage_${index}`]}
                  </span>
                )}
                {color.hoverImagePreview && (
                  <div className="cp-page__preview-container">
                    <img
                      src={color.hoverImagePreview}
                      alt="Hover Color Preview"
                      className="cp-page__preview-image"
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="cp-page__button-group">
              <button
                type="button"
                className="cp-page__action-btn"
                onClick={() => handleColorChange("add")}
              >
                Add Color
              </button>
              <button
                type="button"
                className="cp-page__danger-btn"
                onClick={() => handleColorChange("remove")}
                disabled={productDetails.colors.length <= 1}
              >
                Remove Color
              </button>
            </div>
          </div>
        </motion.div>

        <div className="cp-page__details-section">
          <h1>Add New Product</h1>
          <div className="cp-page__input-group">
            <label>
              Name <span className="cp-page__required-marker">*</span>
            </label>
            <input
              type="text"
              className="cp-page__form-input"
              name="name"
              value={productDetails.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
            {errors.name && (
              <span className="cp-page__error">{errors.name}</span>
            )}
          </div>

          <div className="cp-page__input-group">
            <label>
              Description <span className="cp-page__required-marker">*</span>
            </label>
            <textarea
              className="cp-page__form-textarea"
              name="description"
              value={productDetails.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
            ></textarea>
            {errors.description && (
              <span className="cp-page__error">{errors.description}</span>
            )}
          </div>

          <div className="cp-page__input-group">
            <label>
              Price <span className="cp-page__required-marker">*</span>
            </label>
            <input
              type="number"
              className="cp-page__form-input"
              name="price"
              value={productDetails.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
            />
            {errors.price && (
              <span className="cp-page__error">{errors.price}</span>
            )}
          </div>

          <div className="cp-page__input-group">
            <label>
              Category <span className="cp-page__required-marker">*</span>
            </label>
            <select
              className="cp-page__form-select"
              name="category"
              value={productDetails.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="cp-page__error">{errors.category}</span>
            )}
          </div>

          <div className="cp-page__input-group">
            <label>
              Sizes <span className="cp-page__required-marker">*</span>
            </label>
            <div className="cp-page__size-manager">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  type="button"
                  className="cp-page__size-btn"
                  onClick={() => handleSizeChange("add", size)}
                >
                  Add {size}
                </button>
              ))}
              {productDetails.sizes.map((size) => (
                <div key={size} className="cp-page__size-tag">
                  <span>{size}</span>
                  <button
                    type="button"
                    className="cp-page__danger-btn"
                    onClick={() => handleSizeChange("remove", size)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {errors.sizes && (
              <span className="cp-page__error">{errors.sizes}</span>
            )}
          </div>

          {/* Main image input has been removed.
              The main product image is now automatically set from the first color's image. */}

          <button
            className="cp-page__action-btn cp-page__publish-btn"
            onClick={handlePublish}
          >
            Publish Product
          </button>
        </div>
      </div>

      <PublishConfirmationModal
        showModal={showConfirmation}
        onClose={cancelPublish}
        onConfirm={confirmPublish}
      />
    </div>
  );
};

export default CreateAProductPage;
