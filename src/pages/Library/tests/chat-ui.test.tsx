import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GeneratorIntro } from '../components/generator/GeneratorIntro';
import { MessageList } from '../components/generator/MessageList';
import { ChatComposer } from '../components/generator/ChatComposer';

// Mock the usePrefersReducedMotion hook
vi.mock('../hooks/usePrefersReducedMotion', () => ({
  usePrefersReducedMotion: () => false,
}));

describe('Chat UI Components', () => {
  describe('GeneratorIntro', () => {
    it('renders with centered input and examples', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      expect(screen.getByText("Describe what you want. We'll build the page.")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Speak naturally/)).toBeInTheDocument();
      expect(screen.getByText('Generate draft')).toBeInTheDocument();
      expect(screen.getByText('SaaS')).toBeInTheDocument();
    });

    it('disables generate button when input is too short', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      const button = screen.getByText('Generate draft');
      expect(button).toBeDisabled();
    });

    it('enables generate button when input is long enough', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      const textarea = screen.getByPlaceholderText(/Speak naturally/);
      fireEvent.change(textarea, { target: { value: 'This is a long enough description for the generator to work properly' } });
      
      const button = screen.getByText('Generate draft');
      expect(button).not.toBeDisabled();
    });

    it('calls onGenerate when button is clicked with valid input', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      const textarea = screen.getByPlaceholderText(/Speak naturally/);
      fireEvent.change(textarea, { target: { value: 'This is a long enough description for the generator to work properly' } });
      
      const button = screen.getByText('Generate draft');
      fireEvent.click(button);
      
      expect(mockOnGenerate).toHaveBeenCalledWith('This is a long enough description for the generator to work properly');
    });

    it('sends on Enter key press', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      const textarea = screen.getByPlaceholderText(/Speak naturally/);
      fireEvent.change(textarea, { target: { value: 'This is a long enough description for the generator to work properly' } });
      fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnGenerate).toHaveBeenCalled();
    });

    it('does not send on Shift+Enter', () => {
      const mockOnGenerate = vi.fn();
      render(<GeneratorIntro onGenerate={mockOnGenerate} />);
      
      const textarea = screen.getByPlaceholderText(/Speak naturally/);
      fireEvent.change(textarea, { target: { value: 'This is a long enough description for the generator to work properly' } });
      fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
      
      expect(mockOnGenerate).not.toHaveBeenCalled();
    });
  });

  describe('MessageList', () => {
    const mockMessages = [
      {
        id: '1',
        role: 'user' as const,
        text: 'Hello, create a landing page for my business',
        timestamp: Date.now()
      },
      {
        id: '2',
        role: 'ai' as const,
        text: 'I\'ll help you create a landing page for your business.',
        timestamp: Date.now()
      },
      {
        id: '3',
        role: 'status' as const,
        text: 'Building your page...',
        timestamp: Date.now()
      }
    ];

    it('renders messages correctly', () => {
      render(<MessageList messages={mockMessages} />);
      
      expect(screen.getByText('Hello, create a landing page for my business')).toBeInTheDocument();
      expect(screen.getByText('I\'ll help you create a landing page for your business.')).toBeInTheDocument();
      expect(screen.getByText('Building your page...')).toBeInTheDocument();
    });

    it('shows empty state when no messages', () => {
      render(<MessageList messages={[]} />);
      
      expect(screen.getByText('Start a conversation to generate your landing page')).toBeInTheDocument();
    });

    it('renders user messages on the right', () => {
      render(<MessageList messages={[mockMessages[0]]} />);
      
      const userMessage = screen.getByText('Hello, create a landing page for my business');
      expect(userMessage.closest('div')).toHaveClass('justify-end');
    });

    it('renders AI messages on the left', () => {
      render(<MessageList messages={[mockMessages[1]]} />);
      
      const aiMessage = screen.getByText('I\'ll help you create a landing page for your business.');
      expect(aiMessage.closest('div')).toHaveClass('justify-start');
    });

    it('renders status messages centered', () => {
      render(<MessageList messages={[mockMessages[2]]} />);
      
      const statusMessage = screen.getByText('Building your page...');
      expect(statusMessage.closest('div')).toHaveClass('justify-center');
    });
  });

  describe('ChatComposer', () => {
    it('renders with textarea and send button', () => {
      const mockOnSend = vi.fn();
      render(<ChatComposer onSend={mockOnSend} />);
      
      expect(screen.getByPlaceholderText('Type your request…')).toBeInTheDocument();
      expect(screen.getByText('Send')).toBeInTheDocument();
    });

    it('sends message on Enter key press', () => {
      const mockOnSend = vi.fn();
      render(<ChatComposer onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText('Type your request…');
      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnSend).toHaveBeenCalledWith('Test message');
    });

    it('does not send on Shift+Enter', () => {
      const mockOnSend = vi.fn();
      render(<ChatComposer onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText('Type your request…');
      fireEvent.change(textarea, { target: { value: 'Test message' } });
      fireEvent.keyPress(textarea, { key: 'Enter', code: 'Enter', shiftKey: true });
      
      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('shows stop button when generating', () => {
      const mockOnSend = vi.fn();
      const mockOnStop = vi.fn();
      render(<ChatComposer onSend={mockOnSend} onStop={mockOnStop} isGenerating={true} />);
      
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    it('disables input when disabled', () => {
      const mockOnSend = vi.fn();
      render(<ChatComposer onSend={mockOnSend} disabled={true} />);
      
      const textarea = screen.getByPlaceholderText('Type your request…');
      expect(textarea).toBeDisabled();
    });

    it('blurs on Escape key', () => {
      const mockOnSend = vi.fn();
      render(<ChatComposer onSend={mockOnSend} />);
      
      const textarea = screen.getByPlaceholderText('Type your request…');
      fireEvent.keyDown(textarea, { key: 'Escape', code: 'Escape' });
      
      expect(document.activeElement).not.toBe(textarea);
    });
  });
});
