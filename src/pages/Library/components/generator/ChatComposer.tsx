import React, { useState, useRef, useEffect } from 'react';
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
    <div className="sticky bottom-0 left-0 right-0 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end space-x-3">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type your request…"
              disabled={disabled || isGenerating}
              className={`
                w-full min-h-[44px] max-h-[120px] p-3 rounded-xl border-2 transition-all duration-200 resize-none
                bg-[hsl(var(--input))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--muted))]
                focus:outline-none focus:ring-0
                ${isFocused 
                  ? 'border-[hsl(var(--accent))] shadow-[var(--e1)]' 
                  : 'border-[hsl(var(--border))] hover:border-[hsl(var(--accent))]/50'
                }
                ${disabled || isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                transition: prefersReducedMotion ? 'none' : 'all 0.2s ease'
              }}
            />
            
            {/* Character count */}
            {inputValue.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-[hsl(var(--muted))]">
                {inputValue.length}/2000
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center space-x-2">
            {isGenerating && onStop && (
              <button
                onClick={onStop}
                className="px-4 py-2 bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] rounded-lg hover:bg-[hsl(var(--destructive))]/90 transition-colors text-sm font-medium"
              >
                Stop
              </button>
            )}
            
            <button
              onClick={handleSubmit}
              disabled={!canSend}
              className={`
                px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200
                ${canSend
                  ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] hover:bg-[hsl(var(--accent))]/90 shadow-[var(--e1)] hover:shadow-[var(--e2)]'
                  : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted))] cursor-not-allowed'
                }
              `}
            >
              Send
            </button>
          </div>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-center">
          <p className="text-xs text-[hsl(var(--muted))]">
            Press <kbd className="px-1 py-0.5 bg-[hsl(var(--secondary))] rounded text-xs">Enter</kbd> to send, 
            <kbd className="px-1 py-0.5 bg-[hsl(var(--secondary))] rounded text-xs ml-1">Shift+Enter</kbd> for new line, 
            <kbd className="px-1 py-0.5 bg-[hsl(var(--secondary))] rounded text-xs ml-1">Esc</kbd> to blur
          </p>
        </div>
      </div>
    </div>
  );
};
