import React, { useEffect, useRef, useState } from "react";

type Props = {
  minChars?: number;
  onSubmit: (text: string) => void;
  examples?: string[];
};

export default function UltraModernReceiver({ minChars = 40, onSubmit, examples = [] }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [touched, setTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => { 
    ref.current?.focus(); 
  }, []);

  const tooShort = text.trim().length < minChars;
  const progress = Math.min((text.trim().length / minChars) * 100, 100);
  const isReady = !tooShort && text.trim().length > 0;

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isReady) {
        onSubmit(text);
      }
    }
  };

  const handleExampleClick = (example: string) => {
    setText(example);
    ref.current?.focus();
  };

  return (
    <div className="min-h-screen flex-center px-4 py-8 relative">
      
      <div className="w-full max-w-4xl relative z-10">
        
        {/* Ultra-Modern Header */}
        <div className="text-center mb-16 animate-fade-in-up relative z-50">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-8 relative z-40">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-caption">AI-Powered Landing Page Generator</span>
          </div>
          
          <h1 className="text-display mb-6 relative z-50 pb-4">
            Create Your Perfect Landing Page
          </h1>
          <p className="text-subheading max-w-2xl mx-auto text-white-600 relative z-40">
            Describe your vision and watch as AI crafts a professional, conversion-optimized landing page tailored to your business
          </p>
        </div>

        {/* Ultra-Modern Main Card */}
        <div 
          className="animate-fade-in-scale relative z-30"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '2.5rem',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          
          {/* Advanced Progress Indicator */}
          <div className="mb-8">
            <div className="flex-between text-caption mb-4">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                Progress
              </span>
              <span className="font-mono text-sm">{text.trim().length}/{minChars}</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Ultra-Modern Textarea */}
          <div className="mb-8">
            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
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
                rows={8}
                placeholder="We're a cutting-edge SaaS platform revolutionizing how teams collaborate. We need a modern, sleek landing page that showcases our AI-powered features, includes social proof from Fortune 500 companies, offers flexible pricing tiers, and drives sign-ups with compelling CTAs..."
                className="resize-none"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  border: isFocused ? '2px solid #0284c7' : '2px solid #e5e7eb',
                  borderRadius: '1rem',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '1rem',
                  lineHeight: '1.7',
                  minHeight: '200px',
                  outline: 'none',
                  transition: 'all 0.25s ease',
                  boxShadow: isFocused ? '0 0 0 4px rgba(2, 132, 199, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}
                aria-describedby="input-help"
              />
              
              {/* Floating Label Effect */}
              {text.length > 0 && (
                <div className="absolute -top-2 left-4 px-2 bg-white text-caption text-blue-600 animate-fade-in-scale">
                  Describe your business
                </div>
              )}
            </div>
          </div>

          {/* Advanced Help Text */}
          <div className="text-center mb-8">
            <p id="input-help" className="text-caption mb-2">
              Be specific about your industry, target audience, and key features
            </p>
            <div className="flex-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd>
                to generate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Shift + Enter</kbd>
                for new line
              </span>
            </div>
          </div>

          {/* Ultra-Modern Submit Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => isReady && onSubmit(text)}
              disabled={!isReady}
              className={`relative overflow-hidden ${
                !isReady ? 'opacity-50 cursor-not-allowed' : ''
              } ${isReady ? 'animate-fade-in-scale' : ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '1.25rem 3rem',
                borderRadius: '1rem',
                fontWeight: '600',
                fontSize: '1.125rem',
                background: isReady ? 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)' : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                border: 'none',
                minHeight: '56px',
                minWidth: '200px',
                boxShadow: isReady ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.25s ease',
                cursor: isReady ? 'pointer' : 'not-allowed'
              }}
              onMouseEnter={(e) => {
                if (isReady) {
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (isReady) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
                }
              }}
              aria-disabled={!isReady}
            >
              {!isReady ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Need {minChars - text.trim().length} more characters
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Landing Page
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Ultra-Modern Examples */}
        {examples.length > 0 && (
          <div className="text-center animate-fade-in-up">
            <h3 className="text-subheading text-gray-700 mb-8">
              Try these examples:
            </h3>
            <div className="grid-auto gap-4">
              {examples.map((ex, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleExampleClick(ex)}
                  className="p-6 text-left group cursor-pointer transition-all duration-300"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '1.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex-center text-white text-sm font-semibold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)'
                      }}
                    >
                      {index + 1}
                    </div>
                    <div 
                      className="text-body transition-colors"
                      style={{
                        color: '#6b7280',
                        fontSize: '1rem',
                        lineHeight: '1.7'
                      }}
                    >
                      {ex}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Ultra-Modern Features */}
        <div className="mt-16 text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-8 text-caption text-gray-500">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              AI-Powered
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              Responsive
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              Fast
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
