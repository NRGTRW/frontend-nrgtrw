import React, { useState, useEffect } from 'react';
import { composePage, getAvailableVariants } from '../generator/composePage';
import { buildSeededPageConfig } from '../generator/buildConfig';
import { generateContentSeed } from '../generator/contentSeed';

const PreviewLayout = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load configuration from localStorage or generate default
    const loadConfig = async () => {
      try {
        const savedConfig = localStorage.getItem('pageConfig');
        if (savedConfig) {
          setConfig(JSON.parse(savedConfig));
        } else {
          // Generate default configuration
          const contentSeed = generateContentSeed({
            brandDescription: "Modern Web Solutions",
            industry: "technology",
            targetAudience: "businesses",
            tone: "corporate"
          });
          
          const defaultConfig = buildSeededPageConfig({
            brandDescription: "Modern Web Solutions",
            industry: "technology",
            targetAudience: "businesses",
            tone: "corporate"
          });
          
          setConfig(defaultConfig);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateSectionVariant = (sectionId, variant) => {
    if (!config) return;
    
    const updatedConfig = {
      ...config,
      sections: config.sections.map(section => 
        section.id === sectionId 
          ? { ...section, variant }
          : section
      )
    };
    
    setConfig(updatedConfig);
    localStorage.setItem('pageConfig', JSON.stringify(updatedConfig));
  };

  const regenerateConfig = () => {
    const newConfig = buildSeededPageConfig({
      brandDescription: "Dynamic Solutions",
      industry: "technology",
      targetAudience: "customers",
      tone: "corporate"
    }, true, Math.random());
    
    setConfig(newConfig);
    localStorage.setItem('pageConfig', JSON.stringify(newConfig));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading preview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">No configuration available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background-light)] dark:bg-[var(--background-dark)]">
      {/* Preview Controls */}
      <div className="fixed top-4 right-4 z-50 bg-white dark:bg-[var(--card-background-dark)] rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="text-lg font-semibold mb-4 text-[var(--text-light)] dark:text-[var(--text-dark)]">
          Preview Controls
        </h3>
        
        <button
          onClick={regenerateConfig}
          className="w-full mb-4 px-4 py-2 bg-[var(--primary)] dark:bg-[var(--primary-dark)] text-white rounded-lg hover:bg-[var(--primary)]/90 dark:hover:bg-[var(--primary-dark)]/90 transition-colors duration-300"
        >
          Regenerate Page
        </button>

        <div className="space-y-3">
          {config.sections.map((section) => {
            const availableVariants = getAvailableVariants(section.id);
            return (
              <div key={section.id} className="space-y-1">
                <label className="text-sm font-medium text-[var(--text-light)] dark:text-[var(--text-dark)] capitalize">
                  {section.id.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <select
                  value={section.variant}
                  onChange={(e) => updateSectionVariant(section.id, parseInt(e.target.value))}
                  className="w-full px-2 py-1 text-sm border border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 rounded bg-white dark:bg-[var(--background-dark)] text-[var(--text-light)] dark:text-[var(--text-dark)]"
                >
                  {availableVariants.map((variant) => (
                    <option key={variant} value={variant}>
                      Variant {variant}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rendered Page */}
      <div className="preview-content">
        {composePage(config).sections.map((section) => {
          const Component = section.component;
          return (
            <Component 
              key={section.id}
              {...section.props}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PreviewLayout;
