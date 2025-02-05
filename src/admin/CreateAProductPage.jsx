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

  // Handle product image and hover image file selection
  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file && file instanceof File) {
      if (imageType === "image") {
        setProductDetails((prevState) => ({
          ...prevState,
          images: [{ imageUrl: file, hoverImage: "" }],
        }));
        setImagePreview(URL.createObjectURL(file));
      } else if (imageType === "hoverImage") {
        setProductDetails((prevState) => {
          const updatedImages = [...prevState.images];
          if (updatedImages.length === 0) {
            updatedImages.push({ imageUrl: null, hoverImage: null });
          }
          updatedImages[0] = { ...updatedImages[0], hoverImage: file };
          return { ...prevState, images: updatedImages };
        });
        setHoverImagePreview(URL.createObjectURL(file));
      }
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

  // Cancel publish action: hide the confirmation popup
  const cancelPublish = () => {
    setShowConfirmation(false);
  };

  // confirmPublish: build FormData and send the POST request to create the product
  const confirmPublish = async () => {
    const formData = new FormData();
  
    // Basic Fields
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("price", productDetails.price);
    formData.append("category", productDetails.category);
  
    // Sizes (Array)
    productDetails.sizes.forEach(size => {
      formData.append("sizes", size);
    });
  
    // Product Images (Array)
    productDetails.images.forEach(image => {
      if (image.imageUrl instanceof File) {
        formData.append("images", image.imageUrl);
      }
      if (image.hoverImage instanceof File) {
        formData.append("images", image.hoverImage);
      }
    });
  
    // Colors (Nested Objects)
   // In confirmPublish function
productDetails.colors.forEach((color, index) => {
  formData.append(`colors[${index}].colorName`, color.colorName);
  
  if (color.imageUrl instanceof File) {
    formData.append(`colors[${index}].imageUrl`, color.imageUrl); // Field name: colors[0].imageUrl
  }
  
  if (color.hoverImage instanceof File) {
    formData.append(`colors[${index}].hoverImage`, color.hoverImage); // Field name: colors[0].hoverImage
  }
});
  
    // Send Request
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/products`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Product published successfully!");
      navigate("/products");
    } catch (error) {
      toast.error("Failed to publish product");
      console.error("Error:", error);
    }
  };
  

  console.log(`${import.meta.env.VITE_API_URL}/products`);

    
  

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
            <label>
              Main Image <span className="cp-page__required-marker">*</span>
            </label>
            <input
              type="file"
              className="cp-page__file-input"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "image")}
            />
            {imagePreview && (
              <div className="cp-page__image-wrapper">
                <div className="cp-page__preview-container">
                  <img src={imagePreview} alt="Main Preview" className="cp-page__preview-image" />
                </div>
                <button
                  className="cp-page__remove-image-btn"
                  onClick={() => setImagePreview(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="cp-page__input-group">
            <label>Hover Image</label>
            <input
              type="file"
              className="cp-page__file-input"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "hoverImage")}
            />
            {hoverImagePreview && (
              <div className="cp-page__image-wrapper">
                <div className="cp-page__preview-container">
                  <img src={hoverImagePreview} alt="Hover Preview" className="cp-page__preview-image" />
                </div>
                <button
                  className="cp-page__remove-image-btn"
                  onClick={() => setHoverImagePreview(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

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
              <button type="button" className="cp-page__danger-btn" onClick={() => handleColorChange("remove")}>
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
            />
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
            >
              <option value="">Select Category</option>
              <option value="Elegance">Elegance</option>
              <option value="Pump Covers">Pump Covers 2</option>
            </select>
          </div>

          <div className="cp-page__input-group">
            <label>
              Sizes <span className="cp-page__required-marker">*</span>
            </label>
            <div className="cp-page__size-manager">
              {["S", "M", "L", "XL", "XXL"].map((size) => (
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
