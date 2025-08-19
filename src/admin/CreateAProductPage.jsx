import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoBackButton from "../components/GoBackButton/GoBackButton";
import { motion } from "framer-motion";
import axios from "axios";
import "./createAProductPage.css";
import PublishConfirmationModal from "../components/Modals/PublishConfirmationModal";

const CreateAProductPage = () => {
  const navigate = useNavigate();

  // Default sizes for the product.
  const defaultSizes = ["S", "M", "L", "XL"];
  const phoneCaseSizes = [
    "iPhone 16",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 15",
    "iPhone 15 Plus",
    "iPhone 15 Pro Max",
    "iPhone 14 Plus",
    "iPhone 14 Pro",
    "iPhone 14 Pro Max",
    "iPhone 13",
    "iPhone 13 Pro",
    "iPhone 13 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",
    "iPhone 11",
    "iPhone 11 Pro Max",
    "iPhone 11 Pro",
    "iPhone 12",
  ];

  // State for categories (fetched from the API).
  const [categories, setCategories] = useState([]);

  // Add subcategory/type state:
  const [accessoryType, setAccessoryType] = useState("");

  // Add availability state:
  const [availability, setAvailability] = useState("available");

  // State for product form values.
  // Separate fields for English and Bulgarian translations.
  const [productDetails, setProductDetails] = useState({
    enName: "",
    enDescription: "",
    price: "",
    category: "", // category id as string
    sizes: [...defaultSizes],
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

  // Fetch categories when component mounts.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/categories`,
        );
        let fetched = response.data || [];

        // Add 'Accessories' only if it doesn't exist
        if (!fetched.some((cat) => cat.name === "Accessories")) {
          fetched.push({ id: "accessories", name: "Accessories" });
        }

        setCategories(fetched);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories.");
      }
    };
    fetchCategories();
  }, []);

  // Add this to the categories fetch effect, after categories are loaded:
  useEffect(() => {
    // Add 'Accessories' as a category if not present
    if (!categories.some((cat) => cat.name === "Accessories")) {
      setCategories((prev) => [
        ...prev,
        { id: "accessories", name: "Accessories" },
      ]);
    }
  }, [categories]);

  // Cleanup any generated object URLs.
  useEffect(() => {
    return () => {
      productDetails.colors.forEach((color) => {
        if (color.imageUrlPreview) URL.revokeObjectURL(color.imageUrlPreview);
        if (color.hoverImagePreview)
          URL.revokeObjectURL(color.hoverImagePreview);
      });
    };
  }, [productDetails]);

  // Handle changes for text inputs.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle size changes.
  const handleSizeChange = (action, size) => {
    if (action === "add") {
      if (!productDetails.sizes.includes(size)) {
        setProductDetails((prev) => ({
          ...prev,
          sizes: [...prev.sizes, size],
        }));
      }
    } else if (action === "remove") {
      setProductDetails((prev) => ({
        ...prev,
        sizes: prev.sizes.filter((s) => s !== size),
      }));
    }
    if (productDetails.sizes.length > 0) {
      setErrors((prev) => ({ ...prev, sizes: "" }));
    }
  };

  // Handle color input changes.
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
    setProductDetails((prev) => ({
      ...prev,
      colors: newColors,
    }));
    setErrors((prev) => ({
      ...prev,
      [`${field === "colorName" ? "colorName" : field}_${index}`]: "",
    }));
  };

  // Add or remove a color option.
  const handleColorChange = (action) => {
    if (action === "add") {
      setProductDetails((prev) => ({
        ...prev,
        colors: [
          ...prev.colors,
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
        setProductDetails((prev) => ({
          ...prev,
          colors: prev.colors.slice(0, -1),
        }));
      }
    }
  };

  // Validate form fields.
  const validateForm = () => {
    const newErrors = {};
    if (!productDetails.enName.trim())
      newErrors.enName = "English Name is required";
    if (!productDetails.enDescription.trim())
      newErrors.enDescription = "English Description is required";
    if (!productDetails.price || parseFloat(productDetails.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!productDetails.category) newErrors.category = "Category is required";
    if (!productDetails.sizes || productDetails.sizes.length === 0)
      newErrors.sizes = "At least one size must be selected";
    productDetails.colors.forEach((color, index) => {
      if (!color.colorName.trim())
        newErrors[`colorName_${index}`] = "Color name is required";
      if (!(color.imageUrl instanceof File))
        newErrors[`colorImage_${index}`] = "Color image is required";
      if (!(color.hoverImage instanceof File))
        newErrors[`colorHoverImage_${index}`] = "Color hover image is required";
    });
    return newErrors;
  };

  // Cancel publish.
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

    // Ensure translation fields are defined (default to empty strings).
    const enName = productDetails.enName || "";
    const enDescription = productDetails.enDescription || "";
    const bgName = "AUTO-GENERATED";
    const bgDescription = "AUTO-GENERATED";

    // For fallback, find the real id for 'Available' from categories:
    const availableCategory = categories.find(
      (cat) => cat.name === "Available",
    );

    // Build payload for product creation.
    // (Notice that the translation fields are included at the top level)
    const categoryIdToSend =
      availability === "available" &&
      !productDetails.category &&
      availableCategory
        ? availableCategory.id
        : Number(productDetails.category);
    const productData = {
      enName,
      enDescription,
      bgName,
      bgDescription,
      price: parseFloat(productDetails.price),
      categoryId: categoryIdToSend,
      sizes: productDetails.sizes,
      colors: productDetails.colors.map((color) => ({
        colorName: color.colorName,
      })),
      availability,
      translations: {
        create: [
          {
            language: "en",
            name: enName,
            description: enDescription,
            imageUrl: "temp-main-image",
          },
          {
            language: "bg",
            name: bgName,
            description: bgDescription,
            imageUrl: "temp-main-image",
          },
        ],
      },
    };

    console.log("Payload:", productData); // Debug

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      if (response.data.success) {
        const productId = response.data.product.id;
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

  // Handle image uploads (separate endpoint).
  const handleImageUploads = async (productId) => {
    const formData = new FormData();
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
        },
      );
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handlePublish = () => {
    confirmPublish();
  };

  // Remove 'Available' and duplicate 'Accessories' from categories in the selector:
  const filteredCategories = categories.filter(
    (cat, idx, arr) =>
      cat.name !== "Available" &&
      arr.findIndex((c) => c.name === cat.name) === idx,
  );

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
                  onChange={(e) =>
                    handleColorInputChange(e, index, "colorName")
                  }
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
                  onChange={(e) =>
                    handleColorInputChange(e, index, "hoverImage")
                  }
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
          {/* English Translation Fields */}
          <div className="cp-page__input-group">
            <label>
              English Name <span className="cp-page__required-marker">*</span>
            </label>
            <input
              type="text"
              className="cp-page__form-input"
              name="enName"
              value={productDetails.enName}
              onChange={handleInputChange}
              placeholder="Enter English product name"
            />
            {errors.enName && (
              <span className="cp-page__error">{errors.enName}</span>
            )}
          </div>
          <div className="cp-page__input-group">
            <label>
              English Description{" "}
              <span className="cp-page__required-marker">*</span>
            </label>
            <textarea
              className="cp-page__form-textarea"
              name="enDescription"
              value={productDetails.enDescription}
              onChange={handleInputChange}
              placeholder="Enter English product description"
            ></textarea>
            {errors.enDescription && (
              <span className="cp-page__error">{errors.enDescription}</span>
            )}
          </div>

          {/* Other product details */}
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
            <label>Availability</label>
            <select
              className="cp-page__form-select"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              required
            >
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <div className="cp-page__input-group">
            <label>
              Category <span className="cp-page__required-marker">*</span>
            </label>
            <select
              className="cp-page__form-select"
              name="category"
              value={productDetails.category}
              onChange={(e) => {
                handleInputChange(e);
                if (e.target.value === "accessories") setAccessoryType("");
              }}
              required
            >
              <option value="">Select Category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="cp-page__error">{errors.category}</span>
            )}
          </div>

          {productDetails.category === "accessories" && (
            <div className="cp-page__input-group">
              <label>Accessory Type</label>
              <select
                className="cp-page__form-select"
                value={accessoryType}
                onChange={(e) => setAccessoryType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="phone-case">Phone Case</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <div className="cp-page__input-group">
            <label>
              Sizes <span className="cp-page__required-marker">*</span>
            </label>
            <div className="cp-page__size-manager">
              {productDetails.category === "accessories"
                ? phoneCaseSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className="cp-page__size-btn"
                      onClick={() => handleSizeChange("add", size)}
                    >
                      Add {size}
                    </button>
                  ))
                : defaultSizes.map((size) => (
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
