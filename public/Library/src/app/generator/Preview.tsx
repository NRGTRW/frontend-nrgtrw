import React from 'react';
import { UI_STRINGS } from '../../strings/ui';

interface PreviewProps {
  pageConfig?: any;
  onGenerateDraft?: () => void;
}

export default function Preview({ pageConfig, onGenerateDraft }: PreviewProps) {
  // Empty state when no page
  if (!pageConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {UI_STRINGS.emptyStates.noPage.title}
            </h2>
            <p className="text-gray-600 mb-8">
              {UI_STRINGS.emptyStates.noPage.body}
            </p>
            {onGenerateDraft && (
              <button
                onClick={onGenerateDraft}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {UI_STRINGS.emptyStates.noPage.cta}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render the actual page when pageConfig exists
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Page content would be rendered here */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Generated Landing Page
          </h1>
          <p className="text-gray-600 mb-6">
            Your landing page has been generated with {pageConfig.sections?.length || 0} sections.
          </p>
          
          {/* Placeholder for actual page content */}
          <div className="bg-gray-100 rounded-lg p-8 text-center">
            <p className="text-gray-500">
              Page content would be rendered here using the composePage function.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              This is a placeholder - the actual page rendering would happen here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
