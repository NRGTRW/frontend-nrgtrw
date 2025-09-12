import React, { useState, useEffect } from 'react';
import { runPlanGeneration } from '../../ai/plan/run';
import { buildRandomizedConfig } from '../../generator/builders';
import { PageConfig } from '../../types/landing';
import { UI_STRINGS } from '../../strings/ui';
import SectionInspector from './SectionInspector';

interface GenerationState {
  status: 'idle' | 'validating' | 'planning' | 'composing' | 'rendering' | 'qa' | 'ready' | 'error';
  userSpeech: string;
  pageConfig: PageConfig | null;
  warnings: string[];
  error: string | null;
  extractedInfo: any;
}

interface AIControls {
  keepToneConsistent: boolean;
  brandWords: string[];
  creativity: number;
  specificity: number;
}

interface SidePanel {
  isOpen: boolean;
  type: 'explain' | 'nudge' | null;
  content: string;
}

interface ManualControls {
  seed: number;
  uniformRandomness: boolean;
  lockedSections: Record<string, boolean>;
}

interface TabState {
  activeTab: 'ai' | 'manual';
}

export default function GeneratorPage() {
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    userSpeech: '',
    pageConfig: null,
    warnings: [],
    error: null,
    extractedInfo: null
  });

  const [aiControls, setAiControls] = useState<AIControls>({
    keepToneConsistent: true,
    brandWords: [],
    creativity: 0.5,
    specificity: 0.7
  });

  const [sidePanel, setSidePanel] = useState<SidePanel>({
    isOpen: false,
    type: null,
    content: ''
  });

  const [manualControls, setManualControls] = useState<ManualControls>({
    seed: Math.floor(Math.random() * 1000000),
    uniformRandomness: true,
    lockedSections: {}
  });

  const [tabState, setTabState] = useState<TabState>({
    activeTab: 'ai'
  });

  const handleGenerate = async () => {
    if (!state.userSpeech.trim()) {
      setState(prev => ({ ...prev, error: 'Please describe your business first' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      status: 'validating',
      error: null,
      warnings: []
    }));

    try {
      // Step 1: Validate input
      setState(prev => ({ ...prev, status: 'planning' }));

      // Step 2: Generate AI plan using server endpoint
      const result = await runPlanGeneration(state.userSpeech, {
        creativity: aiControls.creativity,
        specificity: aiControls.specificity,
        keepTone: aiControls.keepToneConsistent,
        brandWords: aiControls.brandWords,
      });

      // Step 3: Apply plan to create PageConfig
      setState(prev => ({ ...prev, status: 'composing' }));

      // Step 4: Render and QA
      setState(prev => ({ 
        ...prev, 
        status: 'rendering',
        pageConfig: result.pageConfig,
        warnings: result.warnings
      }));

      // Step 5: Ready
      setState(prev => ({ ...prev, status: 'ready' }));

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        status: 'error',
        error: error instanceof Error ? error.message : 'Generation failed'
      }));
    }
  };

  const extractBrandName = (speech: string): string => {
    // Simple heuristic: first few words that look like a company name
    const words = speech.split(/\s+/).slice(0, 3);
    return words.join(' ').replace(/[^\w\s]/g, '') || 'Your Company';
  };

  const getStatusMessage = () => {
    switch (state.status) {
      case 'validating': return UI_STRINGS.progress.checkingInputs;
      case 'planning': return UI_STRINGS.progress.writingHeadlines;
      case 'composing': return UI_STRINGS.progress.mergingPlan;
      case 'rendering': return UI_STRINGS.progress.buildingPage;
      case 'qa': return UI_STRINGS.progress.runningChecks;
      case 'ready': return UI_STRINGS.progress.done;
      case 'error': return UI_STRINGS.status.error;
      default: return '';
    }
  };

  const handleExplainPage = () => {
    setSidePanel({
      isOpen: true,
      type: 'explain',
      content: ''
    });
  };

  const handleNudgeAI = () => {
    setSidePanel({
      isOpen: true,
      type: 'nudge',
      content: ''
    });
  };

  const handleCloseSidePanel = () => {
    setSidePanel({
      isOpen: false,
      type: null,
      content: ''
    });
  };

  const handleAddBrandWord = (word: string) => {
    if (word.trim() && !aiControls.brandWords.includes(word.trim())) {
      setAiControls(prev => ({
        ...prev,
        brandWords: [...prev.brandWords, word.trim()]
      }));
    }
  };

  const handleRemoveBrandWord = (word: string) => {
    setAiControls(prev => ({
      ...prev,
      brandWords: prev.brandWords.filter(w => w !== word)
    }));
  };

  const handleManualRoll = () => {
    const brandName = extractBrandName(state.userSpeech) || 'Your Company';
    const config = buildRandomizedConfig({ name: brandName }, manualControls.seed);
    
    setState(prev => ({
      ...prev,
      pageConfig: config,
      status: 'ready',
      warnings: [],
      error: null
    }));
  };

  const handleSeedChange = (newSeed: number) => {
    setManualControls(prev => ({ ...prev, seed: newSeed }));
  };

  const handleToggleLock = (sectionId: string) => {
    setManualControls(prev => ({
      ...prev,
      lockedSections: {
        ...prev.lockedSections,
        [sectionId]: !prev.lockedSections[sectionId]
      }
    }));
  };

  const handleUpdateSection = (sectionId: string, updates: any) => {
    if (!state.pageConfig) return;
    
    setState(prev => ({
      ...prev,
      pageConfig: {
        ...prev.pageConfig!,
        sections: prev.pageConfig!.sections.map(section =>
          section.id === sectionId ? { ...section, ...updates } : section
        )
      }
    }));
  };

  const handleDuplicateVariant = async (sectionId: string) => {
    try {
      // Call the codegen script to create a new variant
      const { generateNewVariant } = await import('../../scripts/codegen/newVariant');
      generateNewVariant(sectionId);
      
      // Show success message
      setState(prev => ({
        ...prev,
        warnings: [...prev.warnings, `New variant created for ${sectionId}`]
      }));
    } catch (error) {
      console.error('Failed to duplicate variant:', error);
      setState(prev => ({
        ...prev,
        error: `Failed to create new variant: ${error instanceof Error ? error.message : 'Unknown error'}`
      }));
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'r':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            if (tabState.activeTab === 'manual') {
              handleManualRoll();
            } else if (state.status === 'ready') {
              handleGenerate();
            }
          }
          break;
        case '[':
          event.preventDefault();
          // Previous section logic would go here
          break;
        case ']':
          event.preventDefault();
          // Next section logic would go here
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          event.preventDefault();
          // Cycle variant logic would go here
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tabState.activeTab, state.status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Landing Page Generator
              </h1>
              <div className="flex items-center space-x-3">
                {state.status === 'ready' && (
                  <>
                    <button
                      onClick={handleExplainPage}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title={UI_STRINGS.tooltips.explainMyPage}
                    >
                      <span className="mr-2">💡</span>
                      {UI_STRINGS.labels.explainMyPage}
                    </button>
                    <button
                      onClick={handleNudgeAI}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      title={UI_STRINGS.tooltips.nudgeAI}
                    >
                      <span className="mr-2">🎯</span>
                      {UI_STRINGS.labels.nudgeAI}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Left Panel - Controls */}
            <div className="w-80 bg-white border-r border-gray-200 p-6">
              {/* Tab Navigation */}
              <div className="flex mb-6 border-b border-gray-200">
                <button
                  onClick={() => setTabState({ activeTab: 'ai' })}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    tabState.activeTab === 'ai'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  AI
                </button>
                <button
                  onClick={() => setTabState({ activeTab: 'manual' })}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    tabState.activeTab === 'manual'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Manual
                </button>
              </div>

              {/* AI Tab Content */}
              {tabState.activeTab === 'ai' && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">AI Settings</h2>
              
              {/* Keep Tone Consistent */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={aiControls.keepToneConsistent}
                    onChange={(e) => setAiControls(prev => ({ ...prev, keepToneConsistent: e.target.checked }))}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {UI_STRINGS.aiControls.keepToneConsistent}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {UI_STRINGS.tooltips.keepToneConsistent}
                </p>
              </div>

              {/* Brand Words */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {UI_STRINGS.aiControls.brandWordsToKeep}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {aiControls.brandWords.map((word, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {word}
                      <button
                        onClick={() => handleRemoveBrandWord(word)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add brand words..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddBrandWord(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {UI_STRINGS.tooltips.brandWordsToKeep}
                </p>
              </div>

              {/* Creativity Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {UI_STRINGS.aiControls.creativity}
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{UI_STRINGS.aiControls.low}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiControls.creativity}
                    onChange={(e) => setAiControls(prev => ({ ...prev, creativity: parseFloat(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{UI_STRINGS.aiControls.high}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {UI_STRINGS.tooltips.creativity}
                </p>
              </div>

              {/* Specificity Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {UI_STRINGS.aiControls.specificity}
                </label>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">{UI_STRINGS.aiControls.low}</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={aiControls.specificity}
                    onChange={(e) => setAiControls(prev => ({ ...prev, specificity: parseFloat(e.target.value) }))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-500">{UI_STRINGS.aiControls.high}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {UI_STRINGS.tooltips.specificity}
                </p>
              </div>
                </>
              )}

              {/* Manual Tab Content */}
              {tabState.activeTab === 'manual' && (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Manual Controls</h2>
                  
                  {/* Seed Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seed
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={manualControls.seed}
                        onChange={(e) => handleSeedChange(parseInt(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter seed number"
                      />
                      <button
                        onClick={handleManualRoll}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        Roll
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Use the same seed to get identical results
                    </p>
                  </div>

                  {/* Uniform Randomness Toggle */}
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={manualControls.uniformRandomness}
                        onChange={(e) => setManualControls(prev => ({ ...prev, uniformRandomness: e.target.checked }))}
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Uniform randomness
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Ensure even distribution across all variants
                    </p>
                  </div>

                  {/* Locked Sections */}
                  {state.pageConfig && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Locked Sections</h3>
                      <div className="space-y-2">
                        {state.pageConfig.sections.map((section, index) => (
                          <div key={section.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 capitalize">
                              {section.id.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <button
                              onClick={() => handleToggleLock(section.id)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                manualControls.lockedSections[section.id]
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {manualControls.lockedSections[section.id] ? 'Locked' : 'Lock'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Keyboard Shortcuts Help */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Keyboard Shortcuts</h3>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">Ctrl+R</kbd> Re-roll</div>
                      <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">[</kbd> Previous section</div>
                      <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">]</kbd> Next section</div>
                      <div><kbd className="px-1 py-0.5 bg-white rounded text-xs">1-9</kbd> Cycle variants</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Panel - Main Content */}
            <div className="flex-1 p-6">
              {state.status === 'ready' && state.pageConfig ? (
                /* Section Inspector when page is generated */
                <SectionInspector
                  pageConfig={state.pageConfig}
                  onUpdateSection={handleUpdateSection}
                  onDuplicateVariant={handleDuplicateVariant}
                  lockedSections={manualControls.lockedSections}
                  onToggleLock={handleToggleLock}
                />
              ) : (
                /* Input form when no page is generated */
                <div className="max-w-2xl mx-auto">
                  {/* Description Input */}
                  <div className="mb-8">
                    <label 
                      htmlFor="business-description" 
                      className="block text-lg font-medium text-gray-700 mb-3"
                    >
                      {UI_STRINGS.labels.describeBusiness}
                    </label>
                    <textarea
                      id="business-description"
                      value={state.userSpeech}
                      onChange={(e) => setState(prev => ({ ...prev, userSpeech: e.target.value }))}
                      placeholder={UI_STRINGS.emptyStates.noDescription.placeholder}
                      className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      disabled={state.status !== 'idle' && state.status !== 'ready' && state.status !== 'error'}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {UI_STRINGS.help.describeBusiness}
                    </p>
                  </div>

                  {/* Generate Button */}
                  <div className="mb-8">
                    <button
                      onClick={handleGenerate}
                      disabled={state.status !== 'idle' && state.status !== 'ready' && state.status !== 'error'}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                      title={UI_STRINGS.tooltips.generateDraft}
                    >
                      {state.status === 'idle' ? UI_STRINGS.labels.generateDraft : getStatusMessage()}
                    </button>
                  </div>

                  {/* Status and Warnings */}
                  {state.status !== 'idle' && (
                    <div className="mb-6">
                      {state.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                          <p className="text-red-800">{state.error}</p>
                        </div>
                      )}

                      {state.warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                          <h3 className="font-medium text-yellow-800 mb-2">{UI_STRINGS.feedback.warnings}</h3>
                          <ul className="list-disc list-inside text-yellow-700">
                            {state.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {state.status === 'ready' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-green-800">
                            {UI_STRINGS.feedback.success}
                            {state.pageConfig && ` (${state.pageConfig.sections.length} sections)`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Preview Link */}
                  {state.status === 'ready' && state.pageConfig && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <a
                        href="/preview"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View Generated Landing Page →
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {sidePanel.isOpen && (
          <div className="w-96 bg-white border-l border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {sidePanel.type === 'explain' ? 'Page Explanation' : 'Nudge AI'}
              </h3>
              <button
                onClick={handleCloseSidePanel}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            {sidePanel.type === 'explain' && (
              <div className="text-sm text-gray-600">
                <p>Here's why each section and headline was chosen for your page:</p>
                {/* Explanation content would go here */}
              </div>
            )}
            
            {sidePanel.type === 'nudge' && (
              <div>
                <textarea
                  value={sidePanel.content}
                  onChange={(e) => setSidePanel(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Add a quick note to steer the next generation..."
                  className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={() => {
                    // Handle nudge submission
                    handleCloseSidePanel();
                  }}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                >
                  Apply Nudge
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
