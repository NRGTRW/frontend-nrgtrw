import React, { useState, useRef, useEffect } from 'react';
import LibButton from '../LibButton';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ChatComposerProps {
  disabled?: boolean;
  onSend: (text: string) => void;
  onStop?: () => void;
  isGenerating?: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({ 
  disabled = false, 
  onSend, 
  onStop,
  isGenerating = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  // Focus on mount
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    if (inputValue.trim() && !disabled && !isGenerating) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      textareaRef.current?.blur();
    }
  };

  const canSend = inputValue.trim().length > 0 && !disabled && !isGenerating;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-4">
          {/* Enhanced Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your business or landing page idea... (e.g., 'A luxury fitness app for busy professionals')"
              disabled={disabled || isGenerating}
              className={`
                w-full min-h-[56px] max-h-[120px] p-4 rounded-2xl border-2 transition-all duration-200 resize-none
                bg-gray-50 text-gray-900 placeholder:text-gray-500
                focus:outline-none focus:ring-0 focus:bg-white
                ${isFocused 
                  ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-white'
                }
                ${disabled || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                transition: prefersReducedMotion ? 'none' : 'all 0.2s ease'
              }}
            />
            
            {/* Enhanced Character count */}
            {inputValue.length > 0 && (
              <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                {inputValue.length}/2000
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            {isGenerating && onStop && (
              <button
                onClick={onStop}
                aria-label="Stop generation"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  background: '#ffffff',
                  color: '#374151',
                  textDecoration: 'none',
                  border: '1px solid #d1d5db',
                  minHeight: '40px',
                  minWidth: '80px',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.borderColor = '#9ca3af';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#ffffff';
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)';
                }}
              >
                Stop
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: '600',
                fontSize: '0.875rem',
                background: canSend ? 'linear-gradient(135deg, #0284c7 0%, #9333ea 100%)' : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                border: 'none',
                minHeight: '40px',
                minWidth: '80px',
                boxShadow: canSend ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.25s ease',
                cursor: canSend ? 'pointer' : 'not-allowed',
                opacity: canSend ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (canSend) {
                  e.target.style.transform = 'translateY(-1px) scale(1.02)';
                  e.target.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSend) {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              Send
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">Enter</kbd> to send, 
            <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs ml-1">Shift+Enter</kbd> for new line, 
            <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs ml-1">Esc</kbd> to blur
          </p>
        </div>
      </div>
    </div>
  );
};
