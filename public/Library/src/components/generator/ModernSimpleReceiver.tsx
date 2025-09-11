import React, { useEffect, useRef, useState } from "react";

type Props = {
  minChars?: number;
  onSubmit: (text: string) => void;
  examples?: string[];
};

export default function ModernSimpleReceiver({ minChars = 40, onSubmit, examples = [] }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => { 
    ref.current?.focus(); 
  }, []);

  const tooShort = text.trim().length < minChars;
  const progress = Math.min((text.trim().length / minChars) * 100, 100);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!tooShort) {
        onSubmit(text);
      }
    }
  };

  return (
    <div className="min-h-screen flex-center px-4 py-8">
      <div className="w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-display text-gray-900 mb-4">
            Create Your Landing Page
          </h1>
          <p className="text-subheading text-gray-600 max-w-lg mx-auto">
            Describe your business and we'll build a professional landing page
          </p>
        </div>

        {/* Main Card */}
        <div className="modern-card p-8 mb-8">
          
          {/* Progress */}
          <div className="mb-6">
            <div className="flex-between text-caption mb-2">
              <span>Progress</span>
              <span>{text.trim().length}/{minChars}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Textarea */}
          <div className="mb-6">
            <textarea
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched(true)}
              onKeyPress={handleKeyPress}
              rows={6}
              placeholder="We're a boutique fitness studio for busy professionals. We need a modern, energetic landing page with hero section, pricing tiers, testimonials, and a strong call-to-action..."
              className="modern-input resize-none text-body"
              aria-describedby="input-help"
            />
          </div>

          {/* Help Text */}
          <div className="text-center mb-6">
            <p id="input-help" className="text-caption">
              Be specific about your industry, target audience, and key features
            </p>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => !tooShort && onSubmit(text)}
              disabled={tooShort}
              className={`modern-button modern-button-primary px-8 py-3 text-body ${
                tooShort ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-disabled={tooShort}
            >
              {tooShort ? `Need ${minChars - text.trim().length} more characters` : 'Generate Landing Page'}
            </button>
          </div>
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div className="text-center">
            <h3 className="text-subheading text-gray-700 mb-6">
              Try these examples:
            </h3>
            <div className="space-y-3 max-w-xl mx-auto">
              {examples.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setText(ex)}
                  className="w-full p-4 text-left modern-card hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-body text-gray-600 group-hover:text-gray-900 transition-colors">
                    {ex}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts */}
        <div className="text-center mt-8">
          <div className="text-caption space-x-4">
            <span>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to generate</span>
            <span><kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + Enter</kbd> for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
