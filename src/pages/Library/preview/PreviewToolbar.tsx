import React, { useState, useCallback } from 'react';
import { UI_STRINGS } from '../strings/ui';

// Icon component for consistent iconography
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
    share: "🔗",
    save: "💾",
    undo: "↶",
    redo: "↷",
    zoom: "🔍",
    fullscreen: "⛶",
    mobile: "📱",
    tablet: "📱",
    desktop: "🖥️",
    grid: "⊞",
    list: "☰",
    filter: "🔽",
    search: "🔍",
    bell: "🔔",
    user: "👤",
    heart: "❤️",
    star: "⭐",
    flag: "🚩",
    bookmark: "🔖",
    tag: "🏷️",
    calendar: "📅",
    clock: "🕐",
    location: "📍",
    link: "🔗",
    image: "🖼️",
    video: "🎥",
    file: "📄",
    folder: "📁",
    cloud: "☁️",
    wifi: "📶",
    battery: "🔋",
    volume: "🔊",
    mute: "🔇",
    play: "▶️",
    pause: "⏸️",
    stop: "⏹️",
    next: "⏭️",
    previous: "⏮️",
    shuffle: "🔀",
    repeat: "🔁",
    like: "👍",
    dislike: "👎",
    comment: "💬",
    send: "📤",
    receive: "📥",
    edit: "✏️",
    delete: "🗑️",
    add: "➕",
    remove: "➖",
    close: "❌",
    arrow: "➡️",
    up: "⬆️",
    down: "⬇️",
    left: "⬅️",
    right: "➡️",
  };
  return <span className={className}>{icons[name] || "?"}</span>;
};

interface PreviewToolbarProps {
  onGenerateRandom: () => void;
  onGenerateDefault: () => void;
  onExport: () => void;
  onDownload: () => void;
  onReset: () => void;
  onShare: () => void;
  onSave: () => void;
  isGenerating: boolean;
  seed: number;
  onSeedChange: (seed: number) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  showOutline: boolean;
  onToggleOutline: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
}

export const PreviewToolbar: React.FC<PreviewToolbarProps> = ({
  onGenerateRandom,
  onGenerateDefault,
  onExport,
  onDownload,
  onReset,
  onShare,
  onSave,
  isGenerating,
  seed,
  onSeedChange,
  previewMode,
  onPreviewModeChange,
  showOutline,
  onToggleOutline,
  showGrid,
  onToggleGrid,
  zoom,
  onZoomChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const handleExport = useCallback(() => {
    onExport();
    setShowExport(true);
    setTimeout(() => setShowExport(false), 2000);
  }, [onExport]);

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Title and Seed */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <Icon name="eye" />
              {/* <spa🔍 Starting AI plan generation...
aiApi.ts:39 🤖 Sending AI plan request to server...
api/ai/plan:1 
            
            
           Failed to load resource: the server responded with a status of 500 (Internal Server Error)
aiApi.ts:64 ❌ AI plan request failed: Error: HTTP 500: Internal Server Error
    at generateAIPlan (aiApi.ts:51:13)
    at async runPlanGeneration (run.ts:35:24)
    at async handleGenerate (SimpleGeneratorPage.tsx:85:22)
generateAIPlan @ aiApi.ts:64
run.ts:49 ⚠️ Server unavailable, falling back to local fake model: Error: HTTP 500: Internal Server Error
    at runPlanGeneration (run.ts:38:15)
    at async handleGenerate (SimpleGeneratorPage.tsx:85:22)
runPlanGeneration @ run.ts:49
run.ts:63 ✅ AI plan generated successfully via fallbackn>Landing Page Preview</span> */}
            </h1>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Seed:</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => onSeedChange(parseInt(e.target.value) || 0)}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Random seed for reproducible results"
              />
            </div>
          </div>

          {/* Center Section - Preview Controls */}
          <div className="flex items-center space-x-2">
            {/* Preview Mode */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onPreviewModeChange('desktop')}
                className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${
                  previewMode === 'desktop' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title="Desktop view"
              >
                <Icon name="desktop" className="w-3 h-3" />
                <span>Desktop</span>
              </button>
              <button
                onClick={() => onPreviewModeChange('tablet')}
                className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${
                  previewMode === 'tablet' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title="Tablet view"
              >
                <Icon name="tablet" className="w-3 h-3" />
                <span>Tablet</span>
              </button>
              <button
                onClick={() => onPreviewModeChange('mobile')}
                className={`px-3 py-1 text-xs rounded-md transition-colors flex items-center space-x-1 ${
                  previewMode === 'mobile' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                title="Mobile view"
              >
                <Icon name="mobile" className="w-3 h-3" />
                <span>Mobile</span>
              </button>
            </div>

            {/* View Options */}
            <div className="flex items-center space-x-1">
              <button
                onClick={onToggleOutline}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  showOutline 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle section outlines"
              >
                <Icon name="grid" className="w-3 h-3" />
              </button>
              <button
                onClick={onToggleGrid}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  showGrid 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title="Toggle grid overlay"
              >
                <Icon name="grid" className="w-3 h-3" />
              </button>
            </div>

            {/* Zoom Control */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                title="Zoom out"
              >
                <Icon name="minus" className="w-3 h-3" />
              </button>
              <span className="text-xs text-gray-500 min-w-12 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                title="Zoom in"
              >
                <Icon name="plus" className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-3">
            {/* Primary Actions */}
            <button
              onClick={onGenerateRandom}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
            >
              <Icon name="refresh" className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Roll'}</span>
            </button>

            <button
              onClick={onGenerateDefault}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Icon name="settings" className="w-4 h-4" />
              <span>Default</span>
            </button>

            {/* Export Actions */}
            <div className="relative">
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Icon name="copy" className="w-4 h-4" />
                <span>Copy</span>
              </button>
              {showExport && (
                <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-green-100 text-green-800 text-sm rounded shadow-lg animate-in slide-in-from-top-2">
                  Copied to clipboard!
                </div>
              )}
            </div>

            <button
              onClick={onDownload}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Icon name="download" className="w-4 h-4" />
              <span>Download</span>
            </button>

            {/* Advanced Actions */}
            <div className="relative">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Icon name="settings" className="w-4 h-4" />
                <span>More</span>
              </button>
              
              {showAdvanced && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <button
                    onClick={onShare}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Icon name="share" className="w-4 h-4" />
                    <span>Share Preview</span>
                  </button>
                  <button
                    onClick={onSave}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <Icon name="save" className="w-4 h-4" />
                    <span>Save Version</span>
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={onReset}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Icon name="refresh" className="w-4 h-4" />
                    <span>Reset All</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
