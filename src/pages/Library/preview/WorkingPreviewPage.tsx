import React, { useState, useEffect } from 'react';
import { 
  getConfig, 
  getBrand, 
  getSections,
  getIsGenerating,
  getError,
  generateRandomConfig,
  generateDefaultConfig,
  resetToDefaults,
  exportConfig,
  updateBrand
} from './SimpleState';

// Working preview page with simple state
const WorkingPreviewPage: React.FC = () => {
  const [config, setConfig] = useState(getConfig());
  const [brand, setBrand] = useState(getBrand());
  const [sections, setSections] = useState(getSections());
  const [isGenerating, setIsGenerating] = useState(getIsGenerating());
  const [error, setError] = useState(getError());
  const [showExport, setShowExport] = useState(false);
  
  // Update state when it changes - use event-based updates instead of polling
  useEffect(() => {
    const updateState = () => {
      setConfig(getConfig());
      setBrand(getBrand());
      setSections(getSections());
      setIsGenerating(getIsGenerating());
      setError(getError());
    };
    
    // Update immediately
    updateState();
    
    // Use a much longer interval or remove polling entirely
    // Only update every 10 seconds to reduce CPU usage
    const interval = setInterval(updateState, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  const handleBrandUpdate = (field: string, value: string) => {
    updateBrand({ [field]: value });
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Landing Page Generator - Working Preview
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleGenerateRandom}
                disabled={isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Roll'}
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
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
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
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={brand.name}
                  onChange={(e) => handleBrandUpdate('name', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tagline</label>
                <input
                  type="text"
                  value={brand.tagline || ''}
                  onChange={(e) => handleBrandUpdate('tagline', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <input
                  type="text"
                  value={brand.industry || ''}
                  onChange={(e) => handleBrandUpdate('industry', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tone</label>
                <select
                  value={brand.tone || ''}
                  onChange={(e) => handleBrandUpdate('tone', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select Tone</option>
                  <option value="luxury">Luxury</option>
                  <option value="playful">Playful</option>
                  <option value="minimal">Minimal</option>
                  <option value="corporate">Corporate</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Configuration</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Sections</label>
                <p className="text-gray-900">{sections.length}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sections</label>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {sections.map(section => (
                    <div key={section.id} className="flex justify-between text-sm p-2 bg-gray-50 rounded">
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
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm max-h-96 overflow-y-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default WorkingPreviewPage;
