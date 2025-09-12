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
          <LibButton
            onClick={() => onSelectSection?.('explain')}
            variant="secondary"
            size="sm"
            aria-label="Explain my generated page"
          >
            Explain my page
          </LibButton>
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
