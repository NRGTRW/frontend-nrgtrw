import React, { useState } from 'react';
import { usePreviewStore, useConfig, useBrand } from './state';
import { buildDefaultConfig, buildRandomizedConfig } from '../generator/builders';

// Simple preview page that doesn't require component registration
const SimplePreviewPage: React.FC = () => {
  const config = useConfig();
  const brand = useBrand();
  const generateRandomConfig = usePreviewStore(state => state.generateRandomConfig);
  const generateDefaultConfig = usePreviewStore(state => state.generateDefaultConfig);
  const resetToDefaults = usePreviewStore(state => state.resetToDefaults);
  const exportConfig = usePreviewStore(state => state.exportConfig);
  
  const [showExport, setShowExport] = useState(false);
  
  const handleGenerateRandom = () => {
    generateRandomConfig(Math.random() * 1000000);
  };
  
  const handleExport = () => {
    const configJson = exportConfig();
    navigator.clipboard.writeText(configJson).then(() => {
      setShowExport(true);
      setTimeout(() => setShowExport(false), 2000);
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Landing Page Generator - Simple Preview
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGenerateRandom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Roll
              </button>
              <button
                onClick={generateDefaultConfig}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Default
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Export
              </button>
              <button
                onClick={resetToDefaults}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showExport && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-green-700">Configuration copied to clipboard!</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Brand Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{brand.name}</p>
              </div>
              {brand.tagline && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <p className="text-gray-900">{brand.tagline}</p>
                </div>
              )}
              {brand.industry && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <p className="text-gray-900">{brand.industry}</p>
                </div>
              )}
              {brand.tone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tone</label>
                  <p className="text-gray-900">{brand.tone}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Panel - Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Sections</label>
                <p className="text-gray-900">{config.sections.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sections</label>
                <div className="space-y-1">
                  {config.sections.map(section => (
                    <div key={section.id} className="flex justify-between text-sm">
                      <span className="capitalize">{section.id.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-gray-500">Variant {section.variant}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Configuration JSON */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration JSON</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SimplePreviewPage;
