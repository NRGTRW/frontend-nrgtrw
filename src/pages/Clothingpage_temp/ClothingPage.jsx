import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./clothingPage.css";
import { fetchAllProducts } from "../../services/productService";
import GoBackButton from "../../components/GoBackButton/GoBackButton";

const ClothingPage = () => {
  const { t } = useTranslation();
  const { data: allProducts, error } = useSWR("/products", fetchAllProducts);
  const location = useLocation();

  const eleganceRef = useRef(null);
  const pumpCoversRef = useRef(null);
  const confidenceRef = useRef(null);

  useEffect(() => {
    if (location.state?.category) {
      const category = location.state.category;
      let targetElement = null;

      if (category === "Elegance") targetElement = eleganceRef.current;
      else if (category === "Pump Covers") targetElement = pumpCoversRef.current;
      else if (category === "Confidence") targetElement = confidenceRef.current;

      if (targetElement) {
        const yOffset = -80;
        const yPosition = targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: yPosition, behavior: "smooth" });
      }
    }
  }, [location.state]);

  if (error) return <p className="error-message">{t("clothingPage.errorMessage")}</p>;
  if (!allProducts) return <p className="loading-message">{t("clothingPage.loadingMessage")}</p>;

  const eleganceProducts = allProducts.filter((product) => product.categoryId === 1);
  const pumpCoversProducts = allProducts.filter((product) => product.categoryId === 2);
  const confidenceProducts = allProducts.filter((product) => product.categoryId === 3);

  return (
    <div className="clothing-page">
      <GoBackButton />
      <section ref={eleganceRef}>
        <h2 className="section-title">{t("clothingPage.sectionTitles.elegance")}</h2>
        <ProductCard products={eleganceProducts} />
      </section>
      <section ref={pumpCoversRef}>
        <h2 className="section-title">{t("clothingPage.sectionTitles.pumpCovers")}</h2>
        <ProductCard products={pumpCoversProducts} />
      </section>
      <section ref={confidenceRef}>
        <h2 className="section-title">{t("clothingPage.sectionTitles.confidence")}</h2>
        <ProductCard products={confidenceProducts} />
      </section>
    </div>
  );
};

export default ClothingPage;
