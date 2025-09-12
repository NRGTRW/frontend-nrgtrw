import React from 'react';
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { useMemo, useState, useEffect, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { SimpleHomePage } from "./components/SimpleHomePage";
import { ComponentGallery } from "./components/ComponentGallery";
import GlobalBackground from "./components/GlobalBackground";

// Import preview system
import ModernPreviewPage from "./preview/ModernPreviewPage";

// Import new generator page
import SimpleGeneratorPage from "./app/generator/SimpleGeneratorPage";

// Centralized layout imports
import {
  HomeLayouts,
  PricingLayouts,
  GenerateLayouts,
  CustomLayouts,
  DashboardLayouts,
  HeaderLayouts,
  FooterLayouts,
} from "./layouts";

// Layout wrapper components
const HomeLayoutsWrapper = () => (
  <div className="layouts-container">
    {HomeLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const PricingLayoutsWrapper = () => (
  <div className="layouts-container">
    {PricingLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const GenerateLayoutsWrapper = () => (
  <div className="layouts-container">
    {GenerateLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const CustomLayoutsWrapper = () => (
  <div className="layouts-container">
    {CustomLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const DashboardLayoutsWrapper = () => (
  <div className="layouts-container">
    {DashboardLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const HeaderLayoutsWrapper = () => (
  <div className="layouts-container">
    {HeaderLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

const FooterLayoutsWrapper = () => (
  <div className="layouts-container">
    {FooterLayouts.map((Layout, index) => (
      <div key={index} className="layout-item">
        <Layout />
      </div>
    ))}
  </div>
);

// Import preview layout
import PreviewLayout from "./layouts/PreviewLayout";

const LibraryPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="library-page" style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}>
      <GlobalBackground />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/gallery" element={<ComponentGallery />} />
          <Route path="/generator" element={<SimpleGeneratorPage />} />
          <Route path="/preview" element={<ModernPreviewPage />} />
          
          {/* Layout routes */}
          <Route path="/layouts/home" element={<HomeLayoutsWrapper />} />
          <Route path="/layouts/pricing" element={<PricingLayoutsWrapper />} />
          <Route path="/layouts/generate" element={<GenerateLayoutsWrapper />} />
          <Route path="/layouts/custom" element={<CustomLayoutsWrapper />} />
          <Route path="/layouts/dashboard" element={<DashboardLayoutsWrapper />} />
          <Route path="/layouts/header" element={<HeaderLayoutsWrapper />} />
          <Route path="/layouts/footer" element={<FooterLayoutsWrapper />} />
          
          {/* Preview layout */}
          <Route path="/preview-layout" element={<PreviewLayout />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default LibraryPage;
