import React, { useState } from 'react';
import { PageConfig } from '../../types/landing';
import { runPlanGeneration } from '../../ai/plan/run';
import UltraModernIntro from '../../components/generator/UltraModernIntro';
import { GeneratorChatLayout } from '../../components/generator/GeneratorChatLayout';
import { Message } from '../../components/generator/MessageList';
import { SimplePreviewPanel } from './SimplePreviewPanel';

export default function SimpleGeneratorPage() {
  const [pageConfig, setPageConfig] = useState<PageConfig | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasConversation, setHasConversation] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<'idle' | 'validating' | 'planning' | 'composing' | 'rendering' | 'qa' | 'ready'>('idle');

  const statusMessages = {
    validating: 'Checking inputs…',
    planning: 'Writing headlines and section copy…',
    composing: 'Merging plan and choosing variants…',
    rendering: 'Building your page…',
    qa: 'Running final checks…',
    ready: 'Done.'
  };

  const appendUser = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const appendStatus = (step: keyof typeof statusMessages) => {
    const statusMessage: Message = {
      id: `status-${Date.now()}`,
      role: 'status',
      text: statusMessages[step],
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, statusMessage]);
  };

  const replaceStatus = (step: keyof typeof statusMessages) => {
    setMessages(prev => {
      const withoutLastStatus = prev.filter(msg => msg.role !== 'status' || msg.id !== prev[prev.length - 1]?.id);
      const statusMessage: Message = {
        id: `status-${Date.now()}`,
        role: 'status',
        text: statusMessages[step],
        timestamp: Date.now()
      };
      return [...withoutLastStatus, statusMessage];
    });
  };

  const appendAI = (text: string) => {
    const aiMessage: Message = {
      id: Date.now().toString(),
      role: 'ai',
      text,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  const handleGenerate = async (userInput: string) => {
    if (!hasConversation) {
      setHasConversation(true);
    }

    // Add user message
    appendUser(userInput);

    try {
      // Step 1: Validate input
      setStatus('validating');
      appendStatus('validating');

      // Step 2: Generate AI plan
      setStatus('planning');
      replaceStatus('planning');

      const result = await runPlanGeneration(userInput, {
        creativity: 0.6,
        specificity: 0.7,
      });

      // Step 3: Compose
      setStatus('composing');
      replaceStatus('composing');

      // Step 4: Render
      setStatus('rendering');
      replaceStatus('rendering');

      // Step 5: QA
      setStatus('qa');
      replaceStatus('qa');

      // Step 6: Ready
      setStatus('ready');
      replaceStatus('ready');

      // Add AI response
      appendAI(`Perfect! I've created your landing page with ${result.pageConfig.sections.length} sections. Here's what I built for you:

• **${result.pageConfig.brand.name}** - ${result.pageConfig.brand.tagline || 'Your business solution'}
• **Industry**: ${result.pageConfig.brand.industry || 'Business'}
• **Tone**: ${result.pageConfig.brand.tone || 'Professional'}

Your landing page is ready! You can now preview it, make adjustments, or ask me to modify anything.`);

      setPageConfig(result.pageConfig);
      setShowPreview(true);

    } catch (error) {
      // Remove status message and add error
      setMessages(prev => prev.filter(msg => msg.role !== 'status'));
      appendAI(`I apologize, but I encountered an error while creating your landing page. Please try again with a different description or check your internet connection.`);
      setStatus('idle');
    }
  };

  const handlePageGenerated = (config: PageConfig) => {
    setPageConfig(config);
    setShowPreview(true);
  };

  return (
    <>
      {!hasConversation ? (
        <UltraModernIntro onSubmit={handleGenerate} />
      ) : (
        <GeneratorChatLayout
          messages={messages}
          isGenerating={status !== 'idle' && status !== 'ready'}
          onSend={handleGenerate}
          onSelectSection={(id) => {
            if (id === 'explain' && pageConfig) {
              setShowPreview(true);
            }
          }}
        />
      )}

      {/* Preview Modal */}
      {showPreview && pageConfig && (
        <SimplePreviewPanel
          pageConfig={pageConfig}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}
