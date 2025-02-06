import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoBackButton from "../components/GoBackButton";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/styles/createAProductPage.css";
import { uploadImageToS3 } from "../services/productService";
import PublishConfirmationModal from "../components/PublishConfirmationModal";


const CreateAProductPage = () => {
  const navigate = useNavigate();

  // Default size options
  const defaultSizes = ["S", "M", "L", "XL"];

  // Product form state
  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: [...defaultSizes],
    images: [{ imageUrl: "", hoverImage: "" }],
    colors: [
      {
        colorName: "",
        imageUrl: "",
        hoverImage: "",
        imageUrlPreview: null,
        hoverImagePreview: null,
      },
    ],
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [hoverImagePreview, setHoverImagePreview] = useState(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (hoverImagePreview) URL.revokeObjectURL(hoverImagePreview);
      productDetails.colors.forEach((color) => {
        if (color.imageUrlPreview) URL.revokeObjectURL(color.imageUrlPreview);
        if (color.hoverImagePreview) URL.revokeObjectURL(color.hoverImagePreview);
      });
    };
  }, [imagePreview, hoverImagePreview, productDetails.colors]);

  // Set the main image and hover image to the first color's values
  useEffect(() => {
    if (productDetails.colors.length > 0) {
      const firstColor = productDetails.colors[0];
      if (!productDetails.images[0].imageUrl && firstColor.imageUrl) {
        setProductDetails((prevState) => ({
          ...prevState,
          images: [
            { imageUrl: firstColor.imageUrl, hoverImage: firstColor.hoverImage }
          ],
        }));
      }
    }
  }, [productDetails.colors]);

  // Handle changes for simple input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle size additions and removals
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
  };

  // Handle color input changes (for both text and file inputs)
  const handleColorInputChange = (e, index, field) => {
    if (field === "imageUrl" || field === "hoverImage") {
      const file = e.target.files[0];
      if (file && file instanceof File) {
        const newColors = [...productDetails.colors];
        const previewURL = URL.createObjectURL(file);
        newColors[index] = { 
          ...newColors[index], 
          [field]: file,
          [`${field}Preview`]: previewURL,
        };
        setProductDetails((prevState) => ({
          ...prevState,
          colors: newColors,
        }));
      }
    } else {
      const { name, value } = e.target;
      const newColors = [...productDetails.colors];
      newColors[index] = { ...newColors[index], [name]: value };
      setProductDetails((prevState) => ({
        ...prevState,
        colors: newColors,
      }));
    }
  };

  // Handle adding or removing a color option
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
      setProductDetails((prevState) => ({
        ...prevState,
        colors: prevState.colors.slice(0, -1),
      }));
    }
  };

  // Disable the remove color button if there's only one color
  const isRemoveDisabled = productDetails.colors.length <= 1;

  // Cancel publish action: hide the confirmation popup
  const cancelPublish = () => {
    setShowConfirmation(false);
  };

  // Confirm and publish product
  const confirmPublish = async () => {
    // Validate category selection
    const categoryMap = {
      elegance: 1, // Changed to lowercase
      "pump covers": 2, // Changed to lowercase
    };
    const selectedCategory = productDetails.category.toLowerCase().trim();
    const categoryId = categoryMap[selectedCategory];
    if (!categoryId) {
      toast.error("Invalid category selected");
      return;
    }

    // Prepare product data (without images)
    const productData = {
      name: productDetails.name,
      description: productDetails.description,
      price: parseFloat(productDetails.price),
      categoryId: categoryId,
      sizes: productDetails.sizes,
      colors: productDetails.colors.map((color) => ({
        colorName: color.colorName,
      })),
    };

    try {
      // 1. Create product with basic data
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

      // 2. Upload images separately if creation succeeded
      if (response.data.success) {
        await handleImageUploads(response.data.productId);
        toast.success("Product published successfully!");
        navigate("/clothing");
      }
    } catch (error) {
      toast.error("Failed to publish product");
      console.error("Error:", error);
    }
  };

  const handleImageUploads = async (productId) => {
    const formData = new FormData();

    // Add main image first to ensure order
    if (productDetails.images[0]?.imageUrl instanceof File) {
      formData.append("mainImage", productDetails.images[0].imageUrl);
    }
    if (productDetails.images[0]?.hoverImage instanceof File) {
      formData.append("hoverImage", productDetails.images[0].hoverImage);
    }

    // Maintain color order when appending files
    productDetails.colors.forEach((color) => {
      if (color.imageUrl instanceof File) {
        formData.append("colorImages", color.imageUrl);
      }
      if (color.hoverImage instanceof File) {
        formData.append("colorHoverImages", color.hoverImage);
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

    // handlePublish: show the confirmation popup
    const handlePublish = () => {
      setShowConfirmation(true); 
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
                <input
                  type="file"
                  className="cp-page__file-input"
                  name="imageUrl"
                  accept="image/*"
                  onChange={(e) => handleColorInputChange(e, index, "imageUrl")}
                />
                {color.imageUrlPreview && (
                  <div className="cp-page__image-wrapper">
                    <div className="cp-page__preview-container">
                      <img src={color.imageUrlPreview} alt="Color Preview" className="cp-page__preview-image" />
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  className="cp-page__file-input"
                  name="hoverImage"
                  accept="image/*"
                  onChange={(e) => handleColorInputChange(e, index, "hoverImage")}
                />
                {color.hoverImagePreview && (
                  <div className="cp-page__image-wrapper">
                    <div className="cp-page__preview-container">
                      <img src={color.hoverImagePreview} alt="Hover Color Preview" className="cp-page__preview-image" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div className="cp-page__button-group">
              <button type="button" className="cp-page__action-btn" onClick={() => handleColorChange("add")}>
                Add Color
              </button>
              <button type="button" className="cp-page__danger-btn" onClick={() => handleColorChange("remove")} disabled={isRemoveDisabled}>
                Remove Color
              </button>
            </div>
          </div>
        </motion.div>

        <div className="cp-page__details-section">
          <h1>Add New Product</h1>
          <div className="cp-page__input-group">
            <label>Name <span className="cp-page__required-marker">*</span></label>
            <input
              type="text"
              className="cp-page__form-input"
              name="name"
              value={productDetails.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
            />
          </div>

          <div className="cp-page__input-group">
            <label>Description <span className="cp-page__required-marker">*</span></label>
            <textarea
              className="cp-page__form-textarea"
              name="description"
              value={productDetails.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
            />
          </div>

          <div className="cp-page__input-group">
            <label>Price <span className="cp-page__required-marker">*</span></label>
            <input
              type="number"
              className="cp-page__form-input"
              name="price"
              value={productDetails.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
            />
          </div>

          <div className="cp-page__input-group">
            <label>Category <span className="cp-page__required-marker">*</span></label>
            <select
              className="cp-page__form-select"
              name="category"
              value={productDetails.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              <option value="elegance">Elegance</option>
              <option value="pump covers">Pump Covers</option>
            </select>
          </div>

          <div className="cp-page__input-group">
            <label>Sizes <span className="cp-page__required-marker">*</span></label>
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
          </div>

          <button className="cp-page__action-btn cp-page__publish-btn" onClick={handlePublish}>
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
