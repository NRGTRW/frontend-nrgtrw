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
        <div key={message.id} className="flex justify-center my-6">
          <FadeIn>
            <div className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full shadow-sm">
              {isActiveStatus && (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )}
              <span className="text-sm text-blue-700 font-medium">
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
            <div className="max-w-[80%] bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl rounded-br-md px-6 py-4 shadow-lg">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
            </div>
          </SlideUp>
        </div>
      );
    }

    if (message.role === 'ai') {
      return (
        <div key={message.id} className="flex justify-start my-4">
          <FadeIn>
            <div className="max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-bl-md px-6 py-4 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">AI</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
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
      className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500 max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Create Your Landing Page?</h3>
            <p className="text-gray-600">Describe your business or idea and I'll generate a professional landing page for you. Be as detailed as you'd like!</p>
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
