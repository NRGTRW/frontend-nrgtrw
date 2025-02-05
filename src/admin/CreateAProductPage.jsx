import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import GoBackButton from "../components/GoBackButton";
import { motion } from "framer-motion";
import axios from "axios";
import "../assets/styles/createAProductPage.css";

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
    sizes: [...defaultSizes], // Initializing sizes with default values
    images: [{ imageUrl: "", hoverImage: "" }],
    colors: [{ colorName: "", imageUrl: "", hoverImage: "" }],
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [hoverImagePreview, setHoverImagePreview] = useState(null);

  // Handle input changes for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevState) => ({
      ...prevState,
      [name]: value,  // Update the main level field (like name, description, price)
    }));
  };

  // Handle nested inputs (like sizes, colors, images)
  const handleNestedInputChange = (e, index, type) => {
    const { name, value } = e.target;
    const updatedArray = [...productDetails[type]];
    updatedArray[index] = { ...updatedArray[index], [name]: value };
    setProductDetails((prevState) => ({
      ...prevState,
      [type]: updatedArray,  // Update the nested array (like sizes, colors, images)
    }));
  };

  // Handle size additions/removals
  const handleSizeChange = (action, size) => {
    if (action === "add") {
      // Add size if it's not already in the list
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

  // Handle image and hover image upload
  // Update image handling for the main image and hover image
const handleImageChange = (e, imageType) => {
  const file = e.target.files[0]; // Get the actual file object
  if (file && file instanceof File) {
    // If it's the main image
    if (imageType === "image") {
      setProductDetails((prevState) => ({
        ...prevState,
        images: [
          ...prevState.images,
          { imageUrl: file, hoverImage: "" }, // Add File object to state
        ],
      }));
    }
    // If it's the hover image
    else if (imageType === "hoverImage") {
      setProductDetails((prevState) => ({
        ...prevState,
        images: [
          ...prevState.images.slice(0, prevState.images.length - 1),
          { ...prevState.images[prevState.images.length - 1], hoverImage: file }, // Update hover image with File object
        ],
      }));
    }
  }
};

// Update color input handling
const handleColorInputChange = (e, index, field) => {
  const { name, value } = e.target;
  if (field === "imageUrl" || field === "hoverImage") {
    const file = e.target.files[0]; // Get the color file object
    if (file && file instanceof File) {
      const newColors = [...productDetails.colors];
      newColors[index] = { ...newColors[index], [field]: file }; // Add File object to state
      setProductDetails((prevState) => ({
        ...prevState,
        colors: newColors,
      }));
    }
  } else {
    const newColors = [...productDetails.colors];
    newColors[index] = { ...newColors[index], [name]: value };
    setProductDetails((prevState) => ({
      ...prevState,
      colors: newColors,
    }));
  }
};



// Handle color addition
const handleColorChange = (action) => {
  if (action === "add") {
    setProductDetails((prevState) => ({
      ...prevState,
      colors: [
        ...prevState.colors,
        { colorName: "", imageUrl: null, hoverImage: null },
      ],
    }));
  }
};



  // Handle publish button click
  const handlePublish = () => {
    setShowConfirmation(true);
  };

  // Confirm publish and save the product
  const confirmPublish = async () => {
    const formData = new FormData();
formData.append("name", productDetails.name);
formData.append("description", productDetails.description);
formData.append("price", productDetails.price);
formData.append("category", productDetails.category);

// Append sizes (make sure you send them as an array)
productDetails.sizes.forEach((size) => {
  formData.append("sizes[]", size);
});

// Append images (main image and hover images)
productDetails.images.forEach((image, index) => {
  if (image.imageUrl instanceof File) {
    formData.append(`images[${index}].imageUrl`, image.imageUrl);
  }
  if (image.hoverImage instanceof File) {
    formData.append(`images[${index}].hoverImage`, image.hoverImage);
  }
});

// Append colors
productDetails.colors.forEach((color, index) => {
  formData.append(`colors[${index}].colorName`, color.colorName);
  if (color.imageUrl instanceof File) {
    formData.append(`colors[${index}].imageUrl`, color.imageUrl);
  }
  if (color.hoverImage instanceof File) {
    formData.append(`colors[${index}].hoverImage`, color.hoverImage);
  }
});


  
    // Log FormData entries before sending
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/products`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/clothing"); // Redirect after success
      } else {
        toast.error("Failed to create product.");
      }
    } catch (error) {
      console.error("Error publishing product:", error.message);
      toast.error("Failed to create product.");
    }
  };  

  // Cancel publish action
  const cancelPublish = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="create-product-page">
      <GoBackButton />
      <div className="create-spacer-bar"></div>

      <div className="product-container">
        <motion.div
          className="product-images"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Product Images</h2>
          <label>Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "image")}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Main Preview" />
            </div>
          )}
          <label>Hover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, "hoverImage")}
          />
          {hoverImagePreview && (
            <div className="image-preview">
              <img src={hoverImagePreview} alt="Hover Preview" />
            </div>
          )}
        </motion.div>

        <div className="product-details">
          <h1>Add New Product</h1>

          <label>Name</label>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
          />

          <label>Description</label>
          <textarea
            name="description"
            value={productDetails.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
          />

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={productDetails.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
          />

          <label>Category</label>
          <select
            name="category"
            value={productDetails.category}
            onChange={handleInputChange}
          >
            <option value="">Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
          </select>

          <label>Sizes</label>
          <div className="size-management">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeChange("add", size)}
              >
                Add {size}
              </button>
            ))}
            {productDetails.sizes.map((size) => (
              <div key={size}>
                <span>{size}</span>
                <button
                  type="button"
                  onClick={() => handleSizeChange("remove", size)}
                >
                  Remove {size}
                </button>
              </div>
            ))}
          </div>

          <label>Color Options</label>
          {productDetails.colors.map((color, index) => (
            <div key={index} className="color-option">
              <input
                type="text"
                name="colorName"
                placeholder="Color Name"
                value={color.colorName}
                onChange={(e) => handleNestedInputChange(e, index, "colors")}
              />
              <input
                type="file"
                accept="image/*"
                name="imageUrl"
                onChange={(e) => handleNestedInputChange(e, index, "colors")}
              />
              <input
                type="file"
                accept="image/*"
                name="hoverImage"
                onChange={(e) => handleNestedInputChange(e, index, "colors")}
              />
            </div>
          ))}
          <button type="button" onClick={() => handleColorChange("add")}>
            Add Color
          </button>

          <button className="publish-button" onClick={handlePublish}>
            Publish
          </button>
        </div>
      </div>

      {/* Confirmation Pop-up */}
      {showConfirmation && (
        <div className="confirmation-popup">
          <p>Are you sure you're ready to publish this product?</p>
          <button onClick={confirmPublish}>Yes, Publish</button>
          <button onClick={cancelPublish}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CreateAProductPage;
