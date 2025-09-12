import React from 'react';
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import { useMemo, useState, useEffect, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { UltraModernNavigation } from "./components/UltraModernNavigation";
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
    <div className="library-page">
      <GlobalBackground />
      <HashRouter>
        <UltraModernNavigation />
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<SimpleHomePage />} />
            <Route path="/gallery" element={<ComponentGallery />} />
            <Route path="/generator" element={<SimpleGeneratorPage />} />
            <Route path="/preview" element={<ModernPreviewPage />} />
            
            {/* Layout routes */}
            <Route path="/layouts/home" element={<HomeLayouts />} />
            <Route path="/layouts/pricing" element={<PricingLayouts />} />
            <Route path="/layouts/generate" element={<GenerateLayouts />} />
            <Route path="/layouts/custom" element={<CustomLayouts />} />
            <Route path="/layouts/dashboard" element={<DashboardLayouts />} />
            <Route path="/layouts/header" element={<HeaderLayouts />} />
            <Route path="/layouts/footer" element={<FooterLayouts />} />
            
            {/* Preview layout */}
            <Route path="/preview-layout" element={<PreviewLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </div>
  );
};

export default LibraryPage;
