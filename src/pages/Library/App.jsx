import { HashRouter, Routes, Route } from "react-router-dom";
import { useMemo, useState, useEffect, Suspense } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { UltraModernNavigation } from "./components/UltraModernNavigation";
import { SimpleHomePage } from "./components/SimpleHomePage";
import { ComponentGallery } from "./components/ComponentGallery";
import GlobalBackground from "./components/GlobalBackground";

// Import component registry to register all components (disabled temporarily)
// import "./components/registry";

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

const layoutSets = {
  home: HomeLayouts,
  pricing: PricingLayouts,
  generate: GenerateLayouts,
  custom: CustomLayouts,
  dashboard: DashboardLayouts,
  headers: HeaderLayouts,
  footers: FooterLayouts,
};

const getRandomIndex = (key) =>
  Math.floor(Math.random() * layoutSets[key].length);

function useLayoutSwitcher() {
  const [locked, setLocked] = useState({});
  const [overrides, setOverrides] = useState({});
  const [seed, setSeed] = useState(0);

  const getLayout = (key) => {
    const idx = locked[key] ?? overrides[key] ?? getRandomIndex(key);
    return layoutSets[key][idx];
  };

  const lockLayout = (key, index) =>
    setLocked((prev) => ({ ...prev, [key]: index }));
  const overrideLayout = (key, index) =>
    setOverrides((prev) => ({ ...prev, [key]: index }));
  const rerollLayouts = () => setSeed(Math.random());

  return {
    getLayout,
    lockLayout,
    overrideLayout,
    locked,
    rerollLayouts,
    seed,
  };
}

export default function App() {
  const { getLayout } = useLayoutSwitcher();

  // Memoize layout components with proper dependency tracking
  const layoutComponents = useMemo(
    () => ({
      HomeComponent: getLayout("home"),
      PricingComponent: getLayout("pricing"),
      GenerateComponent: getLayout("generate"),
      CustomComponent: getLayout("custom"),
      DashboardComponent: getLayout("dashboard"),
      HeaderComponent: getLayout("headers"),
      FooterComponent: getLayout("footers"),
    }),
    [getLayout]
  );

  // Add loading state for initial mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <HashRouter>
      {/* Global Background */}
      <GlobalBackground />
      
      {/* Navigation */}
      <UltraModernNavigation />
      
      {/* Main routes */}
      <main className="pt-20">
        <Routes>
          <Route
            path="/"
            element={<SimpleHomePage />}
          />
          <Route
            path="/pricing"
            element={
              layoutComponents.PricingComponent && (
                <layoutComponents.PricingComponent />
              )
            }
          />
          <Route
            path="/generate"
            element={
              layoutComponents.GenerateComponent && (
                <layoutComponents.GenerateComponent />
              )
            }
          />
          <Route
            path="/custom"
            element={
              layoutComponents.CustomComponent && (
                <layoutComponents.CustomComponent />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              layoutComponents.DashboardComponent && (
                <layoutComponents.DashboardComponent />
              )
            }
          />
          <Route
            path="/preview"
            element={<ModernPreviewPage />}
          />
          <Route
            path="/generator"
            element={<SimpleGeneratorPage />}
          />
          <Route
            path="/gallery"
            element={<ComponentGallery />}
          />
        </Routes>
      </main>
    </HashRouter>
  );
}
