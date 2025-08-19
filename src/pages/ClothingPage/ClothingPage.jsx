import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import ProductCard from "../../components/ProductCard/ProductCard";
import ClothingVoteSection from "../../components/ClothingVoteSection/ClothingVoteSection";
import "./clothingPage.css";
import { fetchAllProducts } from "../../services/productService";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { fetchAllTemuProducts } from "../../services/temuProductService";

const ClothingPage = () => {
  const { t } = useTranslation();
  const { data: allProducts, error } = useSWR("/products", fetchAllProducts);
  const location = useLocation();
  const [temuProducts, setTemuProducts] = useState([]);

  const availableRef = useRef(null);
  const voteSectionRef = useRef(null);

  useEffect(() => {
    // Fetch all Temu products on mount
    fetchAllTemuProducts().then(setTemuProducts);
  }, []);

  useEffect(() => {
    if (location.state?.category) {
      const category = location.state.category;
      let targetElement = null;

      if (category === "Available") targetElement = availableRef.current;
      else if (category === "Vote") targetElement = voteSectionRef.current;

      if (targetElement) {
        const yOffset = -80;
        const yPosition =
          targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }
    }
  }, [location.state]);

  if (error) {
    console.error("Clothing page error:", error);
    return (
      <div className="error-container">
        <p className="error-message">{t("clothingPage.errorMessage")}</p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!allProducts) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>{t("clothingPage.loadingMessage")}</p>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log("ClothingPage - allProducts:", allProducts);
  console.log("ClothingPage - allProducts type:", typeof allProducts);
  console.log(
    "ClothingPage - allProducts is array:",
    Array.isArray(allProducts),
  );

  // Check if allProducts is HTML (API error) or not an array
  if (
    typeof allProducts === "string" &&
    allProducts.includes("<!doctype html>")
  ) {
    console.error("API returned HTML instead of JSON - backend might be down");
    return (
      <div className="error-container">
        <p className="error-message">
          Backend server is not responding. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Ensure allProducts is an array
  if (!Array.isArray(allProducts)) {
    console.error("allProducts is not an array:", allProducts);
    return (
      <div className="error-container">
        <p className="error-message">
          Invalid data received from server. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter products for the "Available" category (categoryId 4)
  let availableProducts =
    allProducts.filter((product) => product.categoryId === 4) || [];
  // Add all Temu products to available products if loaded
  if (temuProducts && temuProducts.length > 0) {
    availableProducts = [...temuProducts, ...availableProducts];
  }
  // All other products are considered unavailable
  const unavailableProducts =
    allProducts.filter((product) => product.categoryId !== 4) || [];

  // Group unavailable products by category
  const unavailableByCategory = unavailableProducts.reduce((acc, product) => {
    const cat = product.category?.name || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});

  return (
    <div className="clothing-page">
      <GoBackButton />

      {/* Available Section */}
      <div className="section-header">
        <h2 className="section-title">
          {t("clothingPage.availableSection.title", "Available Now")}
        </h2>
        <p className="section-description">
          {t(
            "clothingPage.availableSection.description",
            "These products are in stock and ready to ship!",
          )}
        </p>
      </div>
      <div className="product-list available-list">
        {/* Render available products here (reuse existing product card component) */}
        {availableProducts.length === 0 ? (
          <p>
            {t(
              "clothingPage.availableSection.noProducts",
              "No available products at the moment.",
            )}
          </p>
        ) : (
          <ProductCard products={availableProducts} showSizes />
        )}
      </div>

      {/* Unavailable/Voting Section */}
      <div className="section-header unavailable-header">
        <h2 className="section-title unavailable-title">
          {t(
            "clothingPage.unavailableSection.title",
            "Vote to Bring These to Life",
          )}
        </h2>
        <p className="section-description unavailable-description">
          {t(
            "clothingPage.unavailableSection.description",
            "These collections are not yet available. Vote for your favorites and if enough people show interest, we’ll make them real!",
          )}
        </p>
      </div>
      <div className="unavailable-categories">
        {Object.entries(unavailableByCategory).map(([cat, products]) => (
          <div key={cat} className="unavailable-category-group">
            <h3 className="unavailable-category-title">{cat}</h3>
            <ProductCard
              products={products}
              showVoteButton
              categoryName={cat}
            />
          </div>
        ))}
      </div>

      {/* Collection Voting Section */}
      <section ref={voteSectionRef}>
        <ClothingVoteSection />
      </section>
    </div>
  );
};

export default ClothingPage;
