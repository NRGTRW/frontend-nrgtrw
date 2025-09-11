import React, { useEffect, useRef, useState } from "react";

type Props = {
  minChars?: number;
  onSubmit: (text: string) => void;
  examples?: string[];
};

export default function ModernTextReceiver({ minChars = 40, onSubmit, examples = [] }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
    <div className="relative mx-auto w-full max-w-4xl px-6 animate-fade-in-up">
      {/* Main container with glass morphism */}
      <div className="modern-card glass p-8 md:p-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl" />
        
        {/* Header */}
        <div className="relative z-10 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Describe what you want
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Tell us about your business and we'll create a stunning landing page tailored just for you
          </p>
        </div>

        {/* Input container */}
        <div className="relative z-10 mb-6">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute -top-2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Textarea container */}
            <div className={`relative rounded-2xl border-2 transition-all duration-300 ${
              isFocused 
                ? 'border-purple-500 shadow-lg shadow-purple-500/20' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}>
              <textarea
                ref={ref}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                  setIsFocused(false);
                  setTouched(true);
                }}
                onKeyPress={handleKeyPress}
                rows={6}
                placeholder="We're a boutique fitness studio for busy professionals. We need a modern, energetic landing page with hero section, pricing tiers, testimonials, and a strong call-to-action..."
                className="w-full p-6 bg-transparent border-0 outline-none resize-none text-lg placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
                aria-describedby="input-help"
              />
              
              {/* Character count */}
              <div className="absolute bottom-4 right-4 text-sm text-gray-400 dark:text-gray-500">
                {text.trim().length}/{minChars}
              </div>
            </div>
          </div>
          
          {/* Help text */}
          <div className="mt-4 text-center">
            <p id="input-help" className="text-sm text-gray-500 dark:text-gray-400">
              💡 Tip: Be specific about your industry, target audience, and key features you want to highlight
            </p>
          </div>
        </div>

        {/* Example prompts */}
        {examples.length > 0 && (
          <div className="relative z-10 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 text-center">
              Try these examples:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setText(ex)}
                  className="p-4 text-left bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-white/70 dark:hover:bg-gray-800/70 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 group"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                    {ex}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => !tooShort && onSubmit(text)}
            disabled={tooShort}
            className={`modern-button modern-button-primary px-8 py-4 text-lg font-semibold min-w-[200px] ${
              tooShort 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:scale-105 active:scale-95'
            }`}
            aria-disabled={tooShort}
          >
            {tooShort ? (
              <>
                <span>Need {minChars - text.trim().length} more characters</span>
              </>
            ) : (
              <>
                <span>✨ Generate Landing Page</span>
              </>
            )}
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
            <div>Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Enter</kbd> to generate</div>
            <div><kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Shift + Enter</kbd> for new line</div>
          </div>
        </div>
      </div>
    </div>
  );
}
