import React, { useState, useMemo } from 'react';
import { 
  HomeLayouts,
  PricingLayouts,
  GenerateLayouts,
  CustomLayouts,
  DashboardLayouts,
  HeaderLayouts,
  FooterLayouts,
  CombinedHeroLayouts,
  CombinedNavbarLayouts,
  CombinedFeaturesLayouts,
} from '../layouts';

const layoutSets = {
  home: HomeLayouts,
  pricing: PricingLayouts,
  generate: GenerateLayouts,
  custom: CustomLayouts,
  dashboard: DashboardLayouts,
  headers: CombinedNavbarLayouts, // Now includes 100+ navbar variants
  footers: FooterLayouts,
  hero: CombinedHeroLayouts, // Now includes 100+ hero variants
  features: CombinedFeaturesLayouts, // Now includes 100+ features variants
};

const getRandomIndex = (key: string) =>
  Math.floor(Math.random() * layoutSets[key].length);

function useLayoutSwitcher() {
  const [locked, setLocked] = useState<Record<string, number>>({});
  const [overrides, setOverrides] = useState<Record<string, number>>({});
  const [seed, setSeed] = useState(0);
  const [currentVariants, setCurrentVariants] = useState<Record<string, number>>({});

  const getLayout = (key: string) => {
    const idx = locked[key] ?? overrides[key] ?? currentVariants[key] ?? getRandomIndex(key);
    return layoutSets[key][idx];
  };

  const lockLayout = (key: string, index: number) => {
    setLocked((prev) => ({ ...prev, [key]: index }));
    setCurrentVariants((prev) => ({ ...prev, [key]: index }));
  };
  
  const overrideLayout = (key: string, index: number) => {
    setOverrides((prev) => ({ ...prev, [key]: index }));
    setCurrentVariants((prev) => ({ ...prev, [key]: index }));
  };
  
  const rerollLayouts = () => {
    setSeed(Math.random());
    // Only reroll unlocked components
    setCurrentVariants((prev) => {
      const newVariants = { ...prev };
      Object.keys(layoutSets).forEach(key => {
        if (locked[key] === undefined) {
          newVariants[key] = getRandomIndex(key);
        }
      });
      return newVariants;
    });
  };

  return {
    getLayout,
    lockLayout,
    overrideLayout,
    locked,
    setLocked,
    currentVariants,
    setCurrentVariants,
    rerollLayouts,
    seed,
  };
}

export const ComponentGallery: React.FC = () => {
  const { getLayout, lockLayout, locked, setLocked, currentVariants, setCurrentVariants, rerollLayouts, seed } = useLayoutSwitcher();
  const [selectedCategory, setSelectedCategory] = useState<string>('home');
  const [showFullPreview, setShowFullPreview] = useState(true); // Always full preview

  // Memoize layout components with proper dependency tracking
  const layoutComponents = useMemo(
    () => ({
      HomeComponent: getLayout("home"),
      PricingComponent: getLayout("pricing"),
      GenerateComponent: getLayout("generate"),
      CustomComponent: getLayout("custom"),
      DashboardComponent: getLayout("dashboard"),
      HeroComponent: getLayout("hero"),
      HeaderComponent: getLayout("headers"),
      FeaturesComponent: getLayout("features"),
      FooterComponent: getLayout("footers"),
    }),
    [locked, seed]
  );

  const categories = [
    { key: 'home', name: 'Home Pages', description: 'Landing pages and home layouts' },
    { key: 'pricing', name: 'Pricing Pages', description: 'Pricing and subscription layouts' },
    { key: 'generate', name: 'Generator Pages', description: 'Page generation interfaces' },
    { key: 'custom', name: 'Custom Pages', description: 'Custom and specialized layouts' },
    { key: 'dashboard', name: 'Dashboard Pages', description: 'Admin and dashboard interfaces' },
    { key: 'hero', name: 'Hero Sections', description: 'Hero components with 100+ style variants' },
    { key: 'headers', name: 'Headers', description: 'Navigation and header components with 100+ variants' },
    { key: 'features', name: 'Features', description: 'Feature showcase components with 100+ variants' },
    { key: 'footers', name: 'Footers', description: 'Footer and contact components' },
  ];

  const getCurrentComponent = () => {
    switch (selectedCategory) {
      case 'home': return layoutComponents.HomeComponent;
      case 'pricing': return layoutComponents.PricingComponent;
      case 'generate': return layoutComponents.GenerateComponent;
      case 'custom': return layoutComponents.CustomComponent;
      case 'dashboard': return layoutComponents.DashboardComponent;
      case 'hero': return layoutComponents.HeroComponent;
      case 'headers': return layoutComponents.HeaderComponent;
      case 'features': return layoutComponents.FeaturesComponent;
      case 'footers': return layoutComponents.FooterComponent;
      default: return layoutComponents.HomeComponent;
    }
  };

  const CurrentComponent = getCurrentComponent();

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] relative">
      {/* Glimmer effects for gallery */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`gallery-particle-${i}`}
            className="absolute w-1 h-1 bg-blue-400/20 dark:bg-blue-300/15 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Sparkle effects */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`gallery-sparkle-${i}`}
            className="absolute w-2 h-2 bg-white/25 dark:bg-white/15 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Component Gallery</h1>
              <p className="text-gray-600 mt-1">Browse and test different layout components</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={rerollLayouts}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg border border-blue-500/20 hover:scale-[1.015] active:scale-[0.985] font-medium"
                aria-label="Shuffle all gallery examples"
                title="Shuffle all gallery examples"
              >
                Shuffle All
              </button>
              {/* Full preview mode is always enabled */}
              {/* <button
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {showFullPreview ? 'Compact View' : 'Full Preview'}
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Category Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 ease-in-out p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.key
                        ? 'bg-blue-50 border border-blue-200 text-blue-600'
                        : 'hover:bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{category.name}</div>
                      {locked[category.key] !== undefined ? (
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                  </button>
                ))}
              </div>

              {/* Component Controls */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Controls</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const currentIndex = currentVariants[selectedCategory] ?? 0;
                      const maxIndex = layoutSets[selectedCategory as keyof typeof layoutSets].length - 1;
                      const nextIndex = currentIndex < maxIndex ? currentIndex + 1 : 0;
                      setCurrentVariants(prev => ({ ...prev, [selectedCategory]: nextIndex }));
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={locked[selectedCategory] !== undefined}
                  >
                    Next Variant
                  </button>
                  {locked[selectedCategory] !== undefined ? (
                    <button
                      onClick={() => {
                        setLocked(prev => {
                          const newLocked = { ...prev };
                          delete newLocked[selectedCategory];
                          return newLocked;
                        });
                      }}
                      className="w-full px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Unlock</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const currentIndex = currentVariants[selectedCategory] ?? 0;
                        lockLayout(selectedCategory, currentIndex);
                      }}
                      className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Lock Current</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="font-medium mb-2 text-gray-900">Current Selection:</div>
                  <div className="space-y-1">
                    <div>Category: {categories.find(c => c.key === selectedCategory)?.name}</div>
                    <div>Variant: {currentVariants[selectedCategory] ?? 0}</div>
                    <div>Seed: {seed.toFixed(4)}</div>
                    <div className="flex items-center space-x-2">
                      <span>Status:</span>
                      {locked[selectedCategory] !== undefined ? (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-green-600 font-medium">Locked</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" />
                          </svg>
                          <span className="text-gray-400">Unlocked</span>
                        </div>
                      )}
                    </div>
                    <div>Total Locked: {Object.keys(locked).length} components</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Component Preview */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-200 ease-in-out overflow-hidden">
              {/* Preview Header */}
              <div className="border-b border-gray-200 p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {categories.find(c => c.key === selectedCategory)?.name} Preview
                    </h3>
                    <p className="text-sm text-gray-600">
                      {categories.find(c => c.key === selectedCategory)?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Variant</span>
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded">
                      {currentVariants[selectedCategory] ?? 0}
                    </span>
                    {locked[selectedCategory] !== undefined ? (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-green-600 font-medium">Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM8 15v-3a2 2 0 114 0v3H8z" />
                        </svg>
                        <span className="text-xs text-gray-400 font-medium">Unlocked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Component Preview */}
              <div className="min-h-screen overflow-y-auto bg-white">
                {CurrentComponent ? (
                  selectedCategory === 'headers' || selectedCategory === 'footers' || selectedCategory === 'hero' || selectedCategory === 'features' ? (
                    <div className="p-4">
                      <div className="relative">
                        <div className="[&_header]:!relative [&_header]:!top-auto [&_header]:!transform-none">
                          <CurrentComponent isVisible={true} colors={{}} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CurrentComponent />
                  )
                ) : (
                  <div className="flex items-center justify-center h-96 text-[hsl(var(--muted))]">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🔧</div>
                      <div>Component not available</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
