import React from 'react';
import { MessageList, Message } from './MessageList';
import { ChatComposer } from './ChatComposer';
import LibButton from '../LibButton';

interface GeneratorChatLayoutProps {
  messages: Message[];
  isGenerating: boolean;
  onSend: (text: string) => void;
  onStop?: () => void;
  onSelectSection?: (id: string) => void;
}

export const GeneratorChatLayout: React.FC<GeneratorChatLayoutProps> = ({
  messages,
  isGenerating,
  onSend,
  onStop,
  onSelectSection
}) => {
  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] flex flex-col">
      {/* Top toolbar - minimal, just for navigation */}
      <div className="flex-shrink-0 border-b border-[hsl(var(--border))] p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--fg))]">Landing Page Assistant</h2>
              <p className="text-sm text-[hsl(var(--muted))]">Describe your business and I'll create a landing page for you</p>
            </div>
          </div>
          
          {/* Floating "Explain my page" button */}
          <button
            onClick={() => onSelectSection?.('explain')}
            aria-label="Explain my generated page"
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
              minWidth: '120px',
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
            Explain my page
          </button>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col min-h-0">
        <MessageList 
          messages={messages} 
          onSelectSection={onSelectSection}
        />
      </div>

      {/* Bottom composer */}
      <ChatComposer
        disabled={false}
        onSend={onSend}
        onStop={onStop}
        isGenerating={isGenerating}
      />
    </div>
  );
};
