import React, { useEffect, useRef, useState } from "react";

type Props = {
  minChars?: number;
  onSubmit: (text: string) => void;
  examples?: string[];
};

export default function CenteredTextReceiver({ minChars = 40, onSubmit, examples = [] }: Props) {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Create Your Landing Page
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto leading-relaxed">
            Describe your business and we'll build a professional landing page tailored to your needs
          </p>
        </div>

        {/* Main Input Card - Centered */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{text.trim().length}/{minChars}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
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
              className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl resize-none text-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white bg-transparent focus:border-blue-500 focus:outline-none transition-colors duration-200"
              aria-describedby="input-help"
            />
          </div>

          {/* Help Text */}
          <div className="text-center mb-6">
            <p id="input-help" className="text-sm text-gray-500 dark:text-gray-400">
              💡 Be specific about your industry, target audience, and key features
            </p>
          </div>

          {/* Submit Button - Centered */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => !tooShort && onSubmit(text)}
              disabled={tooShort}
              className={`px-12 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 ${
                tooShort 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
              aria-disabled={tooShort}
            >
              {tooShort ? `Need ${minChars - text.trim().length} more characters` : 'Generate Landing Page'}
            </button>
          </div>
        </div>

        {/* Examples - Centered */}
        {examples.length > 0 && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-6">
              Try these examples:
            </h3>
            <div className="space-y-3 max-w-xl mx-auto">
              {examples.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setText(ex)}
                  className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors leading-relaxed">
                    {ex}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts - Centered */}
        <div className="text-center mt-8">
          <div className="text-sm text-gray-400 dark:text-gray-500 space-x-4">
            <span>Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to generate</span>
            <span><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Shift + Enter</kbd> for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
