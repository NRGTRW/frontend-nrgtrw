import React from 'react';

interface WarningsBannerProps {
  warnings: string[];
  onDismiss?: () => void;
}

export default function WarningsBanner({ warnings, onDismiss }: WarningsBannerProps) {
  if (warnings.length === 0) {
    return null;
  }

  // Convert technical warnings to user-friendly messages
  const friendlyWarnings = warnings.map(warning => {
    // Array length warnings
    if (warning.includes('trimmed') || warning.includes('clamped')) {
      if (warning.includes('features')) {
        return 'We trimmed extra features to keep things clean and focused.';
      }
      if (warning.includes('testimonials')) {
        return 'We limited testimonials to the most impactful ones.';
      }
      if (warning.includes('faq')) {
        return 'We kept the most important questions and answers.';
      }
      if (warning.includes('pricing')) {
        return 'We streamlined the pricing options for clarity.';
      }
      return 'We adjusted some content to keep it concise and effective.';
    }

    // HTML sanitization warnings
    if (warning.includes('HTML tags detected')) {
      return 'We cleaned up some formatting to ensure everything displays properly.';
    }

    // URL validation warnings
    if (warning.includes('Invalid URL')) {
      return 'We fixed some links to make sure they work correctly.';
    }

    // Missing section warnings
    if (warning.includes('missing section')) {
      return 'We added some standard sections to make your page complete.';
    }

    // Variant bounds warnings
    if (warning.includes('out of bounds')) {
      return 'We adjusted some design choices to use available options.';
    }

    // Default fallback
    return 'We made some adjustments to ensure everything works smoothly.';
  });

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-amber-800">
            We made some adjustments
          </h3>
          <div className="mt-2 text-sm text-amber-700">
            <ul className="list-disc list-inside space-y-1">
              {friendlyWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className="inline-flex bg-amber-50 rounded-md p-1.5 text-amber-500 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-50 focus:ring-amber-600"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
