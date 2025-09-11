import React, { useState, useCallback, useEffect } from 'react';
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
import { UI_STRINGS } from '../strings/ui';
import { PreviewToolbar } from './PreviewToolbar';

// Modern Icon Components
const Icon = ({ name, className = "w-5 h-5" }: { name: string; className?: string }) => {
  const icons: Record<string, string> = {
    copy: "📋",
    download: "⬇️",
    refresh: "🔄",
    settings: "⚙️",
    eye: "👁️",
    code: "💻",
    palette: "🎨",
    lock: "🔒",
    unlock: "🔓",
    plus: "➕",
    minus: "➖",
    check: "✅",
    warning: "⚠️",
    error: "❌",
    info: "ℹ️",
  };
  return <span className={className}>{icons[name] || "?"}</span>;
};

// Enhanced JSON Editor with syntax highlighting
const EnhancedJSONEditor: React.FC<{
  value: any;
  onChange: (value: any) => void;
  sectionId: SectionID;
  label?: string;
}> = ({ value, onChange, sectionId, label = "Props" }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  
  useEffect(() => {
    setJsonString(JSON.stringify(value, null, 2));
  }, [value]);
  
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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      <div className={`transition-all duration-200 ${isExpanded ? 'h-64' : 'h-20'}`}>
        <textarea
          value={jsonString}
          onChange={(e) => handleChange(e.target.value)}
          className={`w-full p-3 border rounded-lg font-mono text-sm resize-none transition-all duration-200 ${
            isValid 
              ? 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
              : 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
          }`}
          placeholder="Enter JSON props..."
          style={{ height: isExpanded ? '256px' : '80px' }}
        />
      </div>
      
      {!isValid && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <Icon name="error" className="w-4 h-4" />
          <span>Invalid JSON syntax</span>
        </div>
      )}
    </div>
  );
};

// Enhanced Brand Input with better UX
const EnhancedBrandInput: React.FC = () => {
  const brand = useBrand();
  const updateBrand = usePreviewStore(state => state.updateBrand);
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <Icon name="palette" />
          <span>Brand Settings</span>
        </h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </button>
      </div>
      
      <div className={`space-y-4 transition-all duration-200 ${isExpanded ? 'opacity-100' : 'opacity-60'}`}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={brand.name}
              onChange={(e) => updateBrand({ name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              type="text"
              value={brand.tagline || ''}
              onChange={(e) => updateBrand({ tagline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your tagline"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <select
              value={brand.industry || ''}
              onChange={(e) => updateBrand({ industry: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Industry</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="ecommerce">E-commerce</option>
              <option value="consulting">Consulting</option>
              <option value="retail">Retail</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
            <select
              value={brand.tone || ''}
              onChange={(e) => updateBrand({ tone: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
    </div>
  );
};

// Enhanced Section Controls with better UX
const EnhancedSectionControls: React.FC<{ sectionId: SectionID }> = ({ sectionId }) => {
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
  
  const sectionName = sectionId.replace(/([A-Z])/g, ' $1').trim();
  
  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      isSelected 
        ? 'border-blue-500 bg-blue-50 shadow-md' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900 capitalize flex items-center space-x-2">
          <Icon name="settings" className="w-4 h-4" />
          <span>{sectionName}</span>
        </h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">V{section.variant}</span>
          <button
            onClick={() => setSelectedSection(isSelected ? null : sectionId)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              isSelected 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isSelected ? 'Selected' : 'Select'}
          </button>
        </div>
      </div>
      
      {isSelected && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Variant</label>
            <div className="flex items-center space-x-2">
              <select
                value={section.variant}
                onChange={(e) => updateSectionVariant(sectionId, parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {availableVariants.map(variant => (
                  <option key={variant} value={variant}>
                    Variant {variant}
                  </option>
                ))}
              </select>
              <button
                onClick={() => duplicateSectionAsVariant(sectionId)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1"
                title="Create new variant"
              >
                <Icon name="plus" className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>
          
          <EnhancedJSONEditor
            value={section.props}
            onChange={(props) => updateSectionProps(sectionId, props)}
            sectionId={sectionId}
            label="Section Props"
          />
        </div>
      )}
    </div>
  );
};

// Toolbar handlers
const useToolbarHandlers = () => {
  const isGenerating = useIsGenerating();
  const generateRandomConfig = usePreviewStore(state => state.generateRandomConfig);
  const generateDefaultConfig = usePreviewStore(state => state.generateDefaultConfig);
  const resetToDefaults = usePreviewStore(state => state.resetToDefaults);
  const exportConfig = usePreviewStore(state => state.exportConfig);
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  
  const handleGenerateRandom = useCallback(() => {
    generateRandomConfig(seed);
  }, [generateRandomConfig, seed]);
  
  const handleExport = useCallback(() => {
    const configJson = exportConfig();
    navigator.clipboard.writeText(configJson);
  }, [exportConfig]);
  
  const handleDownload = useCallback(() => {
    const configJson = exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landing-page-config-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [exportConfig]);
  
  const handleShare = useCallback(() => {
    // TODO: Implement share functionality
    console.log('Share functionality not implemented yet');
  }, []);
  
  const handleSave = useCallback(() => {
    // TODO: Implement save functionality
    console.log('Save functionality not implemented yet');
  }, []);
  
  return {
    isGenerating,
    seed,
    setSeed,
    handleGenerateRandom,
    handleGenerateDefault: generateDefaultConfig,
    handleExport,
    handleDownload,
    handleReset: resetToDefaults,
    handleShare,
    handleSave,
  };
};

// Main Modern Preview Page Component
const ModernPreviewPage: React.FC = () => {
  const config = useConfig();
  const error = useError();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showOutline, setShowOutline] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  
  const toolbarHandlers = useToolbarHandlers();
  
  // Render the composed page
  let renderedPage: React.ReactElement;
  try {
    renderedPage = composePage(config);
  } catch (err) {
    renderedPage = (
      <div className="p-8 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Icon name="error" className="w-8 h-8 text-red-500" />
          <h2 className="text-xl font-semibold text-red-600">Composition Error</h2>
        </div>
        <p className="text-gray-600">{err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    );
  }
  
  const previewSizes = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PreviewToolbar
        onGenerateRandom={toolbarHandlers.handleGenerateRandom}
        onGenerateDefault={toolbarHandlers.handleGenerateDefault}
        onExport={toolbarHandlers.handleExport}
        onDownload={toolbarHandlers.handleDownload}
        onReset={toolbarHandlers.handleReset}
        onShare={toolbarHandlers.handleShare}
        onSave={toolbarHandlers.handleSave}
        isGenerating={toolbarHandlers.isGenerating}
        seed={toolbarHandlers.seed}
        onSeedChange={toolbarHandlers.setSeed}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        showOutline={showOutline}
        onToggleOutline={() => setShowOutline(!showOutline)}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        zoom={zoom}
        onZoomChange={setZoom}
      />
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2">
              <Icon name="error" className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Brand Input */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <EnhancedBrandInput />
            </div>
          </div>
          
          {/* Middle Panel - Live Preview */}
          <div className="col-span-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border overflow-hidden sticky top-6">
              <div className="p-4 border-b bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <Icon name="eye" />
                  <span>Live Preview</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setPreviewMode('desktop')}
                      className={`px-2 py-1 text-xs rounded ${
                        previewMode === 'desktop' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode('tablet')}
                      className={`px-2 py-1 text-xs rounded ${
                        previewMode === 'tablet' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setPreviewMode('mobile')}
                      className={`px-2 py-1 text-xs rounded ${
                        previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                  <button
                    onClick={() => setShowOutline(!showOutline)}
                    className={`px-2 py-1 text-xs rounded ${
                      showOutline ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Outline
                  </button>
                </div>
              </div>
              <div className={`max-h-screen overflow-y-auto ${previewSizes[previewMode]} ${
                showOutline ? 'outline-2 outline-dashed outline-gray-300' : ''
              } ${showGrid ? 'bg-grid-pattern' : ''}`}
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`
              }}>
                {renderedPage}
              </div>
            </div>
          </div>
          
          {/* Right Panel - Section Controls */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Icon name="settings" />
                <span>Section Controls</span>
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {config.sections.map(section => (
                  <EnhancedSectionControls key={section.id} sectionId={section.id} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernPreviewPage;
