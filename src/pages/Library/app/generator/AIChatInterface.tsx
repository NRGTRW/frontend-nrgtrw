import React, { useState, useRef, useEffect } from 'react';
import { runPlanGeneration } from '../../ai/plan/run';
import { PageConfig } from '../../types/landing';
import { UI_STRINGS } from '../../strings/ui';
import { ProgressSteps, defaultGenerationSteps } from '../../components/ui/ProgressSteps';

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  pageConfig?: PageConfig;
  error?: string;
}

interface AIChatInterfaceProps {
  onPageGenerated: (pageConfig: PageConfig) => void;
}

export const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ onPageGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your AI landing page assistant. Tell me about your business and what kind of landing page you'd like to create. For example:\n\n• \"I need a landing page for my SaaS startup that helps restaurants manage orders\"\n• \"Create a landing page for my fitness coaching business targeting busy professionals\"\n• \"I want a landing page for my e-commerce store selling eco-friendly products\"",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setCurrentStep(0);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulate progress steps
      const steps = ['Validating input...', 'Planning structure...', 'Composing content...', 'Rendering page...', 'Final checks...'];
      
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const result = await runPlanGeneration(inputValue.trim(), {
        creativity: 0.6,
        specificity: 0.7,
      });

      // Remove loading message and add success message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...withoutLoading, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `Perfect! I've created your landing page with ${result.pageConfig.sections.length} sections. Here's what I built for you:\n\n• **${result.pageConfig.brand.name}** - ${result.pageConfig.brand.tagline || 'Your business solution'}\n• **Industry**: ${result.pageConfig.brand.industry || 'Business'}\n• **Tone**: ${result.pageConfig.brand.tone || 'Professional'}\n\nYour landing page is ready! You can now preview it, make adjustments, or ask me to modify anything.`,
          timestamp: new Date(),
          pageConfig: result.pageConfig,
        }];
      });

      setCurrentStep(defaultGenerationSteps.length - 1);
      onPageGenerated(result.pageConfig);

    } catch (error) {
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== loadingMessage.id);
        return [...withoutLoading, {
          id: (Date.now() + 2).toString(),
          type: 'assistant',
          content: `I apologize, but I encountered an error while creating your landing page. Please try again with a different description or check your internet connection.`,
          timestamp: new Date(),
          error: error instanceof Error ? error.message : 'Unknown error',
        }];
      });
    } finally {
      setIsLoading(false);
      setCurrentStep(0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--bg))]">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-[hsl(var(--border))] p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))] rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[hsl(var(--fg))]">Landing Page Assistant</h2>
            <p className="text-sm text-[hsl(var(--muted))]">Describe your business and I'll create a landing page for you</p>
          </div>
        </div>
        
        {/* Progress Steps */}
        {isLoading && (
          <div className="mt-4">
            <ProgressSteps 
              steps={defaultGenerationSteps} 
              current={currentStep}
              className="max-w-md"
            />
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-gray-50 text-gray-900 border border-gray-200'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Creating your landing page...</span>
                </div>
              ) : (
                <div className="text-sm">
                  {formatMessage(message.content)}
                </div>
              )}
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your business and what kind of landing page you need..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

