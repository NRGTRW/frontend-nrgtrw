import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getState,
  getConfig, 
  getBrand, 
  getSections,
  getIsGenerating,
  getError,
  getCurrentSeed,
  getValidationErrors,
  getShowOutlines,
  getShowMissingContent,
  generateRandomConfig,
  generateDefaultConfig,
  resetToDefaults,
  exportConfig,
  importConfig,
  updateBrand,
  updateSectionProps,
  updateSectionVariant,
  setSelectedSection,
  setShowOutlines,
  setShowMissingContent,
  setSeed,
  copySeed,
  downloadConfig,
  cycleVariant,
  subscribe
} from './EnhancedState';
import { SectionID } from '../types/landing';

// Enhanced JSON Editor with validation
const JSONEditor: React.FC<{
  value: any;
  onChange: (value: any) => void;
  sectionId: SectionID;
  errors: string[];
}> = ({ value, onChange, sectionId, errors }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(value, null, 2));
  const [isValid, setIsValid] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
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
  
  const hasErrors = errors.length > 0;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Props (JSON)
        </label>
        <div className="flex items-center space-x-2">
          {hasErrors && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {errors.length} error{errors.length !== 1 ? 's' : ''}
            </span>
          )}
          {!isValid && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Invalid JSON
            </span>
          )}
          {isValid && !hasErrors && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Valid
            </span>
          )}
        </div>
      </div>
      
      <textarea
        value={jsonString}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        className={`w-full h-32 p-2 border rounded-md font-mono text-sm transition-colors ${
          isValid 
            ? hasErrors 
              ? 'border-yellow-300 bg-yellow-50' 
              : 'border-gray-300 bg-white'
            : 'border-red-500 bg-red-50'
        } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
        placeholder="Enter JSON props..."
      />
      
      {hasErrors && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">• {error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

// Content suggestion component
const ContentSuggester: React.FC<{
  sectionId: SectionID;
  onSuggest: (suggestions: any) => void;
}> = ({ sectionId, onSuggest }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateSuggestions = async () => {
    setIsGenerating(true);
    
    // Simulate content generation (in real implementation, this would call an AI service)
    setTimeout(() => {
      const suggestions = generateContentSuggestions(sectionId);
      onSuggest(suggestions);
      setIsGenerating(false);
    }, 1000);
  };
  
  return (
    <button
      onClick={generateSuggestions}
      disabled={isGenerating}
      className="w-full px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 disabled:opacity-50"
    >
      {isGenerating ? 'Generating...' : 'Suggest Content'}
    </button>
  );
};

// Generate content suggestions based on section type
const generateContentSuggestions = (sectionId: SectionID): any => {
  const suggestions: Record<SectionID, any> = {
    navbar: {
      links: [
        { label: "Home", href: "/" },
        { label: "Products", href: "/products" },
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" }
      ],
      cta: { label: "Get Started", href: "/signup" }
    },
    hero: {
      headline: "Transform Your Business Today",
      subhead: "Discover innovative solutions that drive growth and success",
      primaryCta: { label: "Start Free Trial", href: "/trial" },
      secondaryCta: { label: "Watch Demo", href: "/demo" }
    },
    socialProof: {
      logos: [
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+1", alt: "Client 1" },
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+2", alt: "Client 2" },
        { kind: "image", src: "https://via.placeholder.com/120x60/cccccc/666666?text=Client+3", alt: "Client 3" }
      ],
      caption: "Trusted by industry leaders"
    },
    features: {
      items: [
        { title: "Lightning Fast", body: "Optimized for speed and performance" },
        { title: "Secure & Reliable", body: "Enterprise-grade security and uptime" },
        { title: "Easy to Use", body: "Intuitive interface for all skill levels" }
      ]
    },
    featureSpotlight: {
      blocks: [
        {
          headline: "Advanced Analytics",
          body: "Get deep insights into your business performance with comprehensive analytics.",
          mediaSide: "right"
        }
      ]
    },
    testimonials: {
      items: [
        {
          quote: "This platform transformed our entire workflow. Highly recommended!",
          name: "Sarah Johnson",
          role: "CEO, TechCorp"
        }
      ]
    },
    metrics: {
      items: [
        { label: "99.9% Uptime", value: "99.9%" },
        { label: "10x Faster", value: "10x" },
        { label: "50% Cost Reduction", value: "50%" }
      ]
    },
    pricing: {
      plans: [
        {
          name: "Starter",
          price: "29",
          period: "/mo",
          features: ["Basic features", "Email support"],
          cta: { label: "Choose Plan", href: "/pricing" }
        },
        {
          name: "Professional",
          price: "99",
          period: "/mo",
          features: ["All starter features", "Priority support"],
          cta: { label: "Choose Plan", href: "/pricing" },
          highlight: true
        }
      ]
    },
    faq: {
      items: [
        { q: "What makes your solution different?", a: "Our platform combines cutting-edge technology with user-friendly design." },
        { q: "How quickly can I get started?", a: "You can be up and running in minutes with our simple setup process." }
      ]
    },
    finalCta: {
      headline: "Ready to Get Started?",
      subhead: "Join thousands of satisfied customers",
      cta: { label: "Start Free Trial", href: "/signup" }
    },
    footer: {
      columns: [
        {
          title: "Product",
          links: [
            { label: "Features", href: "/features" },
            { label: "Pricing", href: "/pricing" }
          ]
        }
      ],
      fineprint: "© 2024 Your Company. All rights reserved."
    }
  };
  
  return suggestions[sectionId] || {};
};

// Variant cloning component
const VariantCloner: React.FC<{
  sectionId: SectionID;
  onClone: () => void;
}> = ({ sectionId, onClone }) => {
  const [isCloning, setIsCloning] = useState(false);
  
  const handleClone = async () => {
    setIsCloning(true);
    
    try {
      // In a real implementation, this would call the codegen script
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the registry and set the new variant as active
      const currentVariant = getSections().find(s => s.id === sectionId)?.variant || 1;
      const newVariant = currentVariant + 1;
      
      if (newVariant <= 7) {
        cycleVariant(sectionId, 'up');
      }
      
      onClone();
    } catch (error) {
      console.error('Failed to clone variant:', error);
    } finally {
      setIsCloning(false);
    }
  };
  
  return (
    <button
      onClick={handleClone}
      disabled={isCloning}
      className="w-full px-3 py-2 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 disabled:opacity-50"
    >
      {isCloning ? 'Cloning...' : 'Clone → New Variant'}
    </button>
  );
};

// Main enhanced preview page
const EnhancedPreviewPage: React.FC = () => {
  const [localState, setLocalState] = useState(getState());
  const [seedInput, setSeedInput] = useState(localState.currentSeed.toString());
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Subscribe to state changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setLocalState(getState());
      setSeedInput(getCurrentSeed().toString());
    });
    return unsubscribe;
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't trigger shortcuts when typing
      }
      
      switch (e.key) {
        case 'r':
          handleGenerateRandom();
          break;
        case 's':
          downloadConfig();
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          if (localState.selectedSection) {
            const variant = parseInt(e.key);
            updateSectionVariant(localState.selectedSection, variant);
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localState.selectedSection]);
  
  const handleGenerateRandom = () => {
    const seed = parseInt(seedInput) || generateSeed();
    generateRandomConfig(seed);
  };
  
  const handleSeedChange = (value: string) => {
    setSeedInput(value);
    const seed = parseInt(value);
    if (!isNaN(seed)) {
      setSeed(seed);
    }
  };
  
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setImportText(content);
        setShowImport(true);
      };
      reader.readAsText(file);
    }
  };
  
  const handleImportConfirm = () => {
    importConfig(importText);
    setShowImport(false);
    setImportText('');
  };
  
  const handleContentSuggest = (sectionId: SectionID) => {
    const suggestions = generateContentSuggestions(sectionId);
    updateSectionProps(sectionId, suggestions);
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Top Toolbar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Landing Page Generator
              </h1>
              
              {/* Seed Input */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Seed:</label>
                <input
                  type="number"
                  value={seedInput}
                  onChange={(e) => handleSeedChange(e.target.value)}
                  className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Seed"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Action Buttons */}
              <button
                onClick={handleGenerateRandom}
                disabled={localState.isGenerating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                title="Roll (R)"
              >
                {localState.isGenerating ? 'Generating...' : 'Roll'}
              </button>
              
              <button
                onClick={copySeed}
                className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                title="Copy Seed"
              >
                Copy Seed
              </button>
              
              <button
                onClick={resetToDefaults}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                title="Reset"
              >
                Reset
              </button>
              
              <div className="border-l border-gray-300 h-6"></div>
              
              <button
                onClick={downloadConfig}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                title="Export Config (S)"
              >
                Export
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                title="Import Config"
              >
                Import
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
              
              <div className="border-l border-gray-300 h-6"></div>
              
              {/* QA Aids */}
              <button
                onClick={() => setShowOutlines(!localState.showOutlines)}
                className={`px-3 py-2 rounded-md text-sm ${
                  localState.showOutlines 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title="Toggle Section Outlines"
              >
                Outlines
              </button>
              
              <button
                onClick={() => setShowMissingContent(!localState.showMissingContent)}
                className={`px-3 py-2 rounded-md text-sm ${
                  localState.showMissingContent 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
                title="Toggle Missing Content Highlights"
              >
                Missing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error Display */}
      {localState.error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-red-700">{localState.error}</p>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Import Configuration</h3>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
              placeholder="Paste JSON configuration here..."
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowImport(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleImportConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Brand Input */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={localState.config.brand.name}
                    onChange={(e) => updateBrand({ name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tagline</label>
                  <input
                    type="text"
                    value={localState.config.brand.tagline || ''}
                    onChange={(e) => updateBrand({ tagline: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Industry</label>
                  <select
                    value={localState.config.brand.industry || ''}
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
                    value={localState.config.brand.tone || ''}
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
            </div>
          </div>
          
          {/* Middle Panel - Live Preview */}
          <div className="col-span-6">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Seed: {localState.currentSeed} | Sections: {localState.config.sections.length}
                </p>
              </div>
              <div className="max-h-screen overflow-y-auto p-4">
                <div className={`space-y-4 ${localState.showOutlines ? 'outline-2 outline-dashed outline-blue-300' : ''}`}>
                  {localState.config.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`p-4 border rounded-lg ${
                        localState.selectedSection === section.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      } ${localState.showOutlines ? 'outline-2 outline-dashed outline-gray-300' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 capitalize">
                          {section.id.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">V{section.variant}</span>
                          <button
                            onClick={() => setSelectedSection(
                              localState.selectedSection === section.id ? null : section.id
                            )}
                            className={`px-2 py-1 text-xs rounded ${
                              localState.selectedSection === section.id 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                            }`}
                          >
                            {localState.selectedSection === section.id ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(section.props, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Panel - Section Controls */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Controls</h3>
              
              {localState.selectedSection ? (
                <div className="space-y-4">
                  {(() => {
                    const section = localState.config.sections.find(s => s.id === localState.selectedSection);
                    const sectionErrors = localState.validationErrors[`section_${localState.config.sections.findIndex(s => s.id === localState.selectedSection)}`] || [];
                    
                    return (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {localState.selectedSection.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => cycleVariant(localState.selectedSection!, 'down')}
                              className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              ←
                            </button>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                              Variant {section?.variant}
                            </span>
                            <button
                              onClick={() => cycleVariant(localState.selectedSection!, 'up')}
                              className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              →
                            </button>
                          </div>
                        </div>
                        
                        <JSONEditor
                          value={section?.props || {}}
                          onChange={(props) => updateSectionProps(localState.selectedSection!, props)}
                          sectionId={localState.selectedSection}
                          errors={sectionErrors}
                        />
                        
                        <div className="space-y-2">
                          <ContentSuggester
                            sectionId={localState.selectedSection}
                            onSuggest={handleContentSuggest}
                          />
                          <VariantCloner
                            sectionId={localState.selectedSection}
                            onClone={() => console.log('Variant cloned!')}
                          />
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Select a section to edit its properties</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedPreviewPage;
