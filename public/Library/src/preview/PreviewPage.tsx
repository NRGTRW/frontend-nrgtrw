import React, { useState, useCallback } from 'react';
import { 
  usePreviewStore, 
  useConfig, 
  useBrand, 
  useSections, 
  useSelectedSection,
  useIsGenerating,
  useError 
} from './state';
import { composePage } from '../generator/composePage';
import { getAvailableVariants } from '../generator/composePage';
import { SectionID } from '../types/landing';

// JSON Editor Component
const JSONEditor: React.FC<{
  value: any;
  onChange: (value: any) => void;
  sectionId: SectionID;
}> = ({ value, onChange, sectionId }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2));
  const [isValid, setIsValid] = useState(true);
  
  const handleChange = useCallback((newValue: string) => {
    setJsonString(newValue);
    try {
      const parsed = JSON.parse(newValue);
      setIsValid(true);
      onChange(parsed);
    } catch {
      setIsValid(false);
    }
  }, [onChange]);
  
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Props (JSON)
      </label>
      <textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        className={`w-full h-32 p-2 border rounded-md font-mono text-sm ${
          isValid ? 'border-gray-300' : 'border-red-500'
        }`}
        placeholder="Enter JSON props..."
      />
      {!isValid && (
        <p className="text-sm text-red-600">Invalid JSON</p>
      )}
    </div>
  );
};

// Brand Input Component
const BrandInput: React.FC = () => {
  const brand = useBrand();
  const updateBrand = usePreviewStore(state => state.updateBrand);
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={brand.name}
          onChange={(e) => updateBrand({ name: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tagline</label>
        <input
          type="text"
          value={brand.tagline || ''}
          onChange={(e) => updateBrand({ tagline: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Industry</label>
        <select
          value={brand.industry || ''}
          onChange={(e) => updateBrand({ industry: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Industry</option>
          <option value="technology">Technology</option>
          <option value="healthcare">Healthcare</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="ecommerce">E-commerce</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tone</label>
        <select
          value={brand.tone || ''}
          onChange={(e) => updateBrand({ tone: e.target.value as any })}
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
  );
};

// Section Controls Component
const SectionControls: React.FC<{ sectionId: SectionID }> = ({ sectionId }) => {
  const sections = useSections();
  const selectedSection = useSelectedSection();
  const updateSectionVariant = usePreviewStore(state => state.updateSectionVariant);
  const updateSectionProps = usePreviewStore(state => state.updateSectionProps);
  const duplicateSectionAsVariant = usePreviewStore(state => state.duplicateSectionAsVariant);
  const setSelectedSection = usePreviewStore(state => state.setSelectedSection);
  
  const section = sections.find(s => s.id === sectionId);
  const availableVariants = getAvailableVariants(sectionId);
  const isSelected = selectedSection === sectionId;
  
  if (!section) return null;
  
  return (
    <div className={`p-4 border rounded-lg ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 capitalize">
          {sectionId.replace(/([A-Z])/g, ' $1').trim()}
        </h4>
        <button
          onClick={() => setSelectedSection(isSelected ? null : sectionId)}
          className={`px-2 py-1 text-xs rounded ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
      
      {isSelected && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Variant</label>
            <select
              value={section.variant}
              onChange={(e) => updateSectionVariant(sectionId, parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              {availableVariants.map(variant => (
                <option key={variant} value={variant}>
                  Variant {variant}
                </option>
              ))}
            </select>
          </div>
          
          <JSONEditor
            value={section.props}
            onChange={(props) => updateSectionProps(sectionId, props)}
            sectionId={sectionId}
          />
          
          <button
            onClick={() => duplicateSectionAsVariant(sectionId)}
            className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Duplicate as Variant
          </button>
        </div>
      )}
    </div>
  );
};

// Main Preview Page Component
const PreviewPage: React.FC = () => {
  const config = useConfig();
  const isGenerating = useIsGenerating();
  const error = useError();
  const generateRandomConfig = usePreviewStore(state => state.generateRandomConfig);
  const generateDefaultConfig = usePreviewStore(state => state.generateDefaultConfig);
  const resetToDefaults = usePreviewStore(state => state.resetToDefaults);
  const exportConfig = usePreviewStore(state => state.exportConfig);
  const setError = usePreviewStore(state => state.setError);
  
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
  
  // Render the composed page
  let renderedPage: React.ReactElement;
  try {
    renderedPage = composePage(config);
  } catch (err) {
    renderedPage = (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Composition Error</h2>
        <p className="text-gray-600">{err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">
              Landing Page Generator
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
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Brand Input */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <BrandInput />
            </div>
          </div>
          
          {/* Middle Panel - Live Preview */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
              </div>
              <div className="max-h-screen overflow-y-auto">
                {renderedPage}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Section Controls */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Controls</h3>
              <div className="space-y-4">
                {config.sections.map(section => (
                  <SectionControls key={section.id} sectionId={section.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
