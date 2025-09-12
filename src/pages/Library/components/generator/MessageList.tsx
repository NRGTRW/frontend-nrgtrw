import React, { useEffect, useRef, useState } from 'react';
import { FadeIn, SlideUp } from '../ui/Animate';

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'status';
  text: string;
  timestamp?: number;
}

interface MessageListProps {
  messages: Message[];
  onSelectSection?: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onSelectSection 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);

  // Auto-scroll to bottom when new messages arrive (only if user is near bottom)
  useEffect(() => {
    if (isNearBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isNearBottom]);

  // Track if user is near bottom of scroll
  useEffect(() => {
    const handleScroll = () => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setIsNearBottom(distanceFromBottom < 100);
      }
    };

    const list = listRef.current;
    if (list) {
      list.addEventListener('scroll', handleScroll);
      return () => list.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderMessage = (message: Message, index: number) => {
    const isLastMessage = index === messages.length - 1;
    const isStatusMessage = message.role === 'status';
    const isActiveStatus = isStatusMessage && isLastMessage;

    if (isStatusMessage) {
      return (
        <div key={message.id} className="flex justify-center my-4">
          <FadeIn>
            <div className="flex items-center space-x-3 px-4 py-2 bg-[hsl(var(--secondary))] rounded-full">
              {isActiveStatus && (
                <div className="w-4 h-4 border-2 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm text-[hsl(var(--muted))]">
                {message.text}
              </span>
            </div>
          </FadeIn>
        </div>
      );
    }

    if (message.role === 'user') {
      return (
        <div key={message.id} className="flex justify-end my-4">
          <SlideUp>
            <div className="max-w-[80%] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] rounded-2xl rounded-br-md px-4 py-3">
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </SlideUp>
        </div>
      );
    }

    if (message.role === 'ai') {
      return (
        <div key={message.id} className="flex justify-start my-4">
          <FadeIn>
            <div className="max-w-[80%] bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--primary))] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[hsl(var(--fg))] whitespace-pre-wrap">
                    {message.text}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto p-4 space-y-2"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-[hsl(var(--muted))]">
            <div className="text-4xl mb-4">💬</div>
            <p>Start a conversation to generate your landing page</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};
