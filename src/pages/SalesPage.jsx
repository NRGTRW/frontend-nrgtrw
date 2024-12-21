// Structured into 3 categories: Elgeance/Pump Covers/Confidence
// Each should be fully functional and with the footer the nav and topbar included as well as another heroimage but different from the main one representing more of the clothing part
import React from "react";
// import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
// import HeroImage from "../components/HeroImage";
import ScrollButton from "../components/ScrollButton";
import "../assets/styles/salesPage.css";


const SalesPage = () => {
  const categories = [
    { name: "Elegance", slug: "elegance" },
    { name: "Pump Covers", slug: "pump-covers" },
    { name: "Confidence", slug: "confidence" },
  ];

  const products = [
    // Replace with dynamic fetching from backend
    {
      id: 1,
      category: "Elegance",
      name: "Classic Black Dress",
      price: 120,
      colors: ["black", "red", "blue"],
      mainImage: "/assets/images/product-images/dress-main.webp",
      hoverImage: "/assets/images/hover-images/dress-hover.webp",
    },
    {
      id: 2,
      category: "Pump Covers",
      name: "Comfort Tank Top",
      price: 45,
      colors: ["white", "grey", "navy"],
      mainImage: "/assets/images/product-images/tank-main.webp",
      hoverImage: "/assets/images/hover-images/tank-hover.webp",
    },
  ];

  return (
    <div className="sales-page">
      {/* <Navbar /> */}
      {/* <HeroImage
        imageSrc="/assets/images/sales-hero-image.webp"
        title="Style Meets Functionality"
        subtitle="Discover the perfect balance of elegance and strength."
      /> */}

      {categories.map((category) => (
        <section key={category.slug} className="category-section">
          <h2>{category.name}</h2>
          <div className="product-grid">
            {products
              .filter((product) => product.category === category.name)
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="product-image main"
                    />
                    <img
                      src={product.hoverImage}
                      alt={`${product.name} Hover`}
                      className="product-image hover"
                    />
                  </div>
                  <div className="product-details">
                    <p className="product-name">{product.name}</p>
                    <p className="product-price">${product.price}</p>
                    <div className="color-options">
                      {product.colors.map((color, index) => (
                        <div
                          key={index}
                          className="color-circle"
                          style={{ backgroundColor: color }}
                          onMouseEnter={() =>
                            console.log(`Switch to color: ${color}`)
                          }
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
      <ScrollButton /> 
      <Footer />
    </div>
  );
};

export default SalesPage;
