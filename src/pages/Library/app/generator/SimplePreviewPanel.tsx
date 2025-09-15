import React, { useState } from 'react';
import { PageConfig } from '../../types/landing';
import { composePage } from '../../generator/composePage';

interface SimplePreviewPanelProps {
  pageConfig: PageConfig | null;
  onClose: () => void;
}

export const SimplePreviewPanel: React.FC<SimplePreviewPanelProps> = ({ pageConfig, onClose }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!pageConfig) return null;

  let renderedPage: React.ReactElement;
  try {
    renderedPage = composePage(pageConfig);
  } catch (err) {
    renderedPage = (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-semibold">Preview Error</h3>
        </div>
        <p className="text-gray-600">{err instanceof Error ? err.message : 'Unknown error'}</p>
      </div>
    );
  }

  const previewSizes = {
    desktop: 'w-full',
    tablet: 'max-w-2xl mx-auto',
    mobile: 'max-w-sm mx-auto'
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 ${isFullscreen ? 'p-0' : ''}`}>
      <div className={`bg-white rounded-xl shadow-2xl ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-7xl h-5/6'} flex flex-col overflow-hidden`}>
        {/* Enhanced Header */}
        <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Landing Page Preview</h2>
                  <p className="text-sm text-gray-600">Live preview of your generated page</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    previewMode === 'desktop' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    previewMode === 'tablet' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Tablet
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    previewMode === 'mobile' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Mobile
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v-4.5M15 15h4.5M15 15l5.5 5.5" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
              <button
                onClick={onClose}
                className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Close preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Preview Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className={`${previewSizes[previewMode]} min-h-full transition-all duration-300 ease-in-out`}>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden m-4">
              {renderedPage}
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {pageConfig.brand.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{pageConfig.brand.name}</div>
                  {pageConfig.brand.tagline && (
                    <div className="text-xs text-gray-600">{pageConfig.brand.tagline}</div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="px-2 py-1 bg-gray-100 rounded-full">{pageConfig.brand.industry}</span>
                <span className="px-2 py-1 bg-gray-100 rounded-full">{pageConfig.brand.tone}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-sm hover:shadow-md">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
