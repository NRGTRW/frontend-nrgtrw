import React, { Suspense, lazy } from 'react';
import { Routes, Route } from "react-router-dom";
import "./index.css";
import { useState, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import LibraryLayout from "./LibraryLayout";

// Lazy load components for better performance
const SimpleHomePage = lazy(() => import("./components/SimpleHomePage").then(module => ({ default: module.SimpleHomePage })));
const ComponentGallery = lazy(() => import("./components/ComponentGallery").then(module => ({ default: module.ComponentGallery })));
const GlobalBackground = lazy(() => import("./components/GlobalBackground"));
const ModernPreviewPage = lazy(() => import("./preview/ModernPreviewPage"));
const SimpleGeneratorPage = lazy(() => import("./app/generator/SimpleGeneratorPage"));

// Lazy load layout wrappers
const HomeLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { HomeLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {HomeLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const PricingLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { PricingLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {PricingLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const GenerateLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { GenerateLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {GenerateLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const CustomLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { CustomLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {CustomLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const DashboardLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { DashboardLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {DashboardLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const HeaderLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { HeaderLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {HeaderLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const FooterLayoutsWrapper = lazy(() => import("./layouts").then(module => {
  const { FooterLayouts } = module;
  return {
    default: () => (
      <div className="layouts-container">
        {FooterLayouts.map((Layout, index) => (
          <div key={index} className="layout-item">
            <Layout />
          </div>
        ))}
      </div>
    )
  };
}));

const PreviewLayout = lazy(() => import("./layouts/PreviewLayout"));


const LibraryPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reduced loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <LibraryLayout>
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
    </LibraryLayout>
  );
};

export default LibraryPage;
